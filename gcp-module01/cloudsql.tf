resource "google_sql_database" "database" {
  name     = "${var.prefix}-database"
  instance = google_sql_database_instance.instance.name
}

resource "google_sql_database_instance" "instance" {
  name   = "${var.prefix}-database-instance"
  database_version = "POSTGRES_11"
  settings {
    tier = var.sql_machine_type
  }

  deletion_protection  = "false"
}