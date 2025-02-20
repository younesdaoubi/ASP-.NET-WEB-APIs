using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpaceManagement.Migrations
{
    /// <inheritdoc />
    public partial class AddSurfaceTextureToPlanet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SurfaceTexture",
                table: "CelestialObjects",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SurfaceTexture",
                table: "CelestialObjects");
        }
    }
}
