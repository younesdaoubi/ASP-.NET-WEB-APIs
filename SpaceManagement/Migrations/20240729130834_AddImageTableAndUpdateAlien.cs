using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpaceManagement.Migrations
{
    /// <inheritdoc />
    public partial class AddImageTableAndUpdateAlien : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "CelestialObjects");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "CelestialObjects");

            migrationBuilder.AddColumn<int>(
                name: "ImageId",
                table: "CelestialObjects",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Images", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CelestialObjects_ImageId",
                table: "CelestialObjects",
                column: "ImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_CelestialObjects_Images_ImageId",
                table: "CelestialObjects",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CelestialObjects_Images_ImageId",
                table: "CelestialObjects");

            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DropIndex(
                name: "IX_CelestialObjects_ImageId",
                table: "CelestialObjects");

            migrationBuilder.DropColumn(
                name: "ImageId",
                table: "CelestialObjects");

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "CelestialObjects",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "CelestialObjects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
