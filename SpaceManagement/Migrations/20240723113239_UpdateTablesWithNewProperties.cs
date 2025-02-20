using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpaceManagement.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTablesWithNewProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Diameter",
                table: "CelestialObjects",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "DistanceFromPlanet",
                table: "CelestialObjects",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "DistanceFromSun",
                table: "CelestialObjects",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Function",
                table: "CelestialObjects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsCarnivorous",
                table: "CelestialObjects",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Mass",
                table: "CelestialObjects",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "OrbitalPeriod",
                table: "CelestialObjects",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReturnDate",
                table: "CelestialObjects",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Spaceship_LaunchDate",
                table: "CelestialObjects",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "XCoordinate",
                table: "CelestialObjects",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "YCoordinate",
                table: "CelestialObjects",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ZCoordinate",
                table: "CelestialObjects",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Diameter",
                table: "CelestialObjects");

            migrationBuilder.DropColumn(
                name: "DistanceFromPlanet",
                table: "CelestialObjects");

            migrationBuilder.DropColumn(
                name: "DistanceFromSun",
                table: "CelestialObjects");

            migrationBuilder.DropColumn(
                name: "Function",
                table: "CelestialObjects");

            migrationBuilder.DropColumn(
                name: "IsCarnivorous",
                table: "CelestialObjects");

            migrationBuilder.DropColumn(
                name: "Mass",
                table: "CelestialObjects");

            migrationBuilder.DropColumn(
                name: "OrbitalPeriod",
                table: "CelestialObjects");

            migrationBuilder.DropColumn(
                name: "ReturnDate",
                table: "CelestialObjects");

            migrationBuilder.DropColumn(
                name: "Spaceship_LaunchDate",
                table: "CelestialObjects");

            migrationBuilder.DropColumn(
                name: "XCoordinate",
                table: "CelestialObjects");

            migrationBuilder.DropColumn(
                name: "YCoordinate",
                table: "CelestialObjects");

            migrationBuilder.DropColumn(
                name: "ZCoordinate",
                table: "CelestialObjects");
        }
    }
}
