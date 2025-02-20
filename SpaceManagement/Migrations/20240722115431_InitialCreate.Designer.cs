﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SpaceManagement.Models;

#nullable disable

namespace SpaceManagement.Migrations
{
    [DbContext(typeof(SpaceManagementContext))]
    [Migration("20240722115431_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("SpaceManagement.Models.CelestialObject", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("CelestialObjectType")
                        .IsRequired()
                        .HasMaxLength(21)
                        .HasColumnType("nvarchar(21)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ImageUrl")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("CelestialObjects");

                    b.HasDiscriminator<string>("CelestialObjectType").HasValue("CelestialObject");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("SpaceManagement.Models.Alien", b =>
                {
                    b.HasBaseType("SpaceManagement.Models.CelestialObject");

                    b.Property<bool>("IsFriendly")
                        .HasColumnType("bit");

                    b.Property<string>("OriginPlanet")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasDiscriminator().HasValue("Alien");
                });

            modelBuilder.Entity("SpaceManagement.Models.Comet", b =>
                {
                    b.HasBaseType("SpaceManagement.Models.CelestialObject");

                    b.Property<DateTime>("NextAppearance")
                        .HasColumnType("datetime2");

                    b.Property<string>("TailColor")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasDiscriminator().HasValue("Comet");
                });

            modelBuilder.Entity("SpaceManagement.Models.Constellation", b =>
                {
                    b.HasBaseType("SpaceManagement.Models.CelestialObject");

                    b.Property<string>("BestViewingMonths")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MainStars")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasDiscriminator().HasValue("Constellation");
                });

            modelBuilder.Entity("SpaceManagement.Models.Moon", b =>
                {
                    b.HasBaseType("SpaceManagement.Models.CelestialObject");

                    b.Property<int>("PlanetId")
                        .HasColumnType("int");

                    b.HasIndex("PlanetId");

                    b.HasDiscriminator().HasValue("Moon");
                });

            modelBuilder.Entity("SpaceManagement.Models.Planet", b =>
                {
                    b.HasBaseType("SpaceManagement.Models.CelestialObject");

                    b.Property<bool>("HasRings")
                        .HasColumnType("bit");

                    b.Property<bool>("SupportsLife")
                        .HasColumnType("bit");

                    b.HasDiscriminator().HasValue("Planet");
                });

            modelBuilder.Entity("SpaceManagement.Models.Satellite", b =>
                {
                    b.HasBaseType("SpaceManagement.Models.CelestialObject");

                    b.Property<string>("OrbitType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasDiscriminator().HasValue("Satellite");
                });

            modelBuilder.Entity("SpaceManagement.Models.Spaceship", b =>
                {
                    b.HasBaseType("SpaceManagement.Models.CelestialObject");

                    b.Property<DateTime>("LaunchDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Mission")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasDiscriminator().HasValue("Spaceship");
                });

            modelBuilder.Entity("SpaceManagement.Models.Moon", b =>
                {
                    b.HasOne("SpaceManagement.Models.Planet", "Planet")
                        .WithMany("Moons")
                        .HasForeignKey("PlanetId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Planet");
                });

            modelBuilder.Entity("SpaceManagement.Models.Planet", b =>
                {
                    b.Navigation("Moons");
                });
#pragma warning restore 612, 618
        }
    }
}
