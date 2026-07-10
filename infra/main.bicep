@description('Var resurserna ska driftsättas.')
param location string = resourceGroup().location

@description('Kort namn-prefix för alla resurser, t.ex. "skiplan".')
@minLength(3)
@maxLength(16)
param appName string = 'skiplan'

@description('Miljönamn, t.ex. prod/staging. Används i resursnamn.')
param environmentName string = 'prod'

@description('Admin-användarnamn för Postgres Flexible Server.')
param postgresAdminUsername string

@secure()
@description('Admin-lösenord för Postgres Flexible Server. Skickas in vid deployment, sparas aldrig i denna fil.')
param postgresAdminPassword string

@description('Entra External ID (CIAM) tenant-ID. Sätts när tenanten är skapad.')
param entraTenantId string = ''

@description('Entra External ID app-registrerings-ID för API:t. Sätts när appen är registrerad.')
param entraApiClientId string = ''

@description('Tillåtna CORS-origins för API:t, t.ex. Static Web App-URL:en. Lägg till efter första deploy.')
param corsAllowedOrigins array = []

var namePrefix = '${appName}-${environmentName}'
var postgresServerName = '${namePrefix}-psql'
var appServicePlanName = '${namePrefix}-plan'
var apiAppName = '${namePrefix}-api'
var staticWebAppName = '${namePrefix}-web'
var databaseName = 'skiplan'

resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2024-08-01' = {
  name: postgresServerName
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    version: '16'
    administratorLogin: postgresAdminUsername
    administratorLoginPassword: postgresAdminPassword
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
}

resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2024-08-01' = {
  parent: postgresServer
  name: databaseName
}

// Tillåt Azure-tjänster (App Service m.fl.) att nå servern.
resource postgresFirewallAllowAzure 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2024-08-01' = {
  parent: postgresServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource apiApp 'Microsoft.Web/sites@2023-12-01' = {
  name: apiAppName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|10.0'
      appSettings: [
        {
          name: 'EntraId__Instance'
          value: 'https://${appName}.ciamlogin.com/'
        }
        {
          name: 'EntraId__TenantId'
          value: entraTenantId
        }
        {
          name: 'EntraId__ClientId'
          value: entraApiClientId
        }
        {
          name: 'Cors__AllowedOrigins__0'
          value: length(corsAllowedOrigins) > 0 ? corsAllowedOrigins[0] : ''
        }
      ]
      connectionStrings: [
        {
          name: 'DefaultConnection'
          connectionString: 'Host=${postgresServer.properties.fullyQualifiedDomainName};Port=5432;Database=${databaseName};Username=${postgresAdminUsername};Password=${postgresAdminPassword};SSL Mode=Require'
          type: 'Custom'
        }
      ]
    }
  }
}

resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {}
}

output apiUrl string = 'https://${apiApp.properties.defaultHostName}'
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
output postgresServerFqdn string = postgresServer.properties.fullyQualifiedDomainName
