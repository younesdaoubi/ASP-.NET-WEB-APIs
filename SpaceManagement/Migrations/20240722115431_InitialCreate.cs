using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpaceManagement.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CelestialObjects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CelestialObjectType = table.Column<string>(type: "nvarchar(21)", maxLength: 21, nullable: false),
                    OriginPlanet = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsFriendly = table.Column<bool>(type: "bit", nullable: true),
                    NextAppearance = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TailColor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MainStars = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BestViewingMonths = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PlanetId = table.Column<int>(type: "int", nullable: true),
                    HasRings = table.Column<bool>(type: "bit", nullable: true),
                    SupportsLife = table.Column<bool>(type: "bit", nullable: true),
                    OrbitType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Mission = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LaunchDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CelestialObjects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CelestialObjects_CelestialObjects_PlanetId",
                        column: x => x.PlanetId,
                        principalTable: "CelestialObjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CelestialObjects_PlanetId",
                table: "CelestialObjects",
                column: "PlanetId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CelestialObjects");
        }
    }
}
