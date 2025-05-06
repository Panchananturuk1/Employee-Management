FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY Fullstack.API/*.csproj ./Fullstack.API/
RUN dotnet restore ./Fullstack.API/Fullstack.API.csproj

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:10000
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 10000

# Start the app
ENTRYPOINT ["dotnet", "Fullstack.API.dll"] 