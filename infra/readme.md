# Infrastructure (Azure Bicep)

Denna mapp innehåller infrastrukturkod för projektet, skriven i Bicep.

`main.bicep` provisionerar:

- **Azure Database for PostgreSQL Flexible Server** (ersätter skolans databas)
- **App Service (Linux, .NET 10)** för API:t
- **Static Web App** för klienten

## Manuella steg innan första deploy

1. **Entra External ID (CIAM)**: skapa en egen tenant i Azure Portal (separat från skolans workforce-tenant), registrera en app för API:t (exponera scope `access_as_user`) och en för SPA:n. Notera Tenant ID och API-appens Client ID.
2. Logga in med `az login` och välj rätt prenumeration (`az account set --subscription <id>`).
3. Kör deployment (lösenordet skickas bara på kommandoraden, hamnar aldrig i en fil):

   ```bash
   az deployment group create \
     --resource-group <ditt-resursgrupp-namn> \
     --template-file main.bicep \
     --parameters main.parameters.json \
     --parameters postgresAdminPassword='<välj-ett-starkt-lösenord>' \
     --parameters entraTenantId='<tenant-id>' entraApiClientId='<api-client-id>'
   ```

4. Efter första deploy: hämta `staticWebAppUrl` från outputen och kör om deploymenten med `corsAllowedOrigins=["<staticWebAppUrl>"]` så att API:t tillåter anrop från klienten.
5. Kör EF Core-migrationerna mot den nya databasen (se separat anteckning om migrationshistorik i `server/EliteSkier.Api/Migrations` — den måste stämmas av mot skolans databas innan den nya servern kan lita på `dotnet ef database update`).
6. Publicera API-koden till App Service och klienten till Static Web App (t.ex. via GitHub Actions — `az staticwebapp` respektive `az webapp deploy`).

## Status

Grundinfrastrukturen är definierad i `main.bicep`. CI/CD för att bygga och publicera koden till dessa resurser är inte uppsatt än.
