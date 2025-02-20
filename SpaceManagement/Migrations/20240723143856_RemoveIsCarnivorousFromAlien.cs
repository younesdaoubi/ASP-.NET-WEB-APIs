using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpaceManagement.Migrations
{
    /// <inheritdoc />
    public partial class RemoveIsCarnivorousFromAlien : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCarnivorous",
                table: "CelestialObjects");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCarnivorous",
                table: "CelestialObjects",
                type: "bit",
                nullable: true);
        }
    }
}
