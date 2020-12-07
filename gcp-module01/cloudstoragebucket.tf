// Storage bucket 정의
resource "google_storage_bucket" "storage_bucket" {
  name     = "${var.prefix}-storage-bucket"
  project  = var.project
  location = var.multi_region

  versioning {
    enabled = true
  }
} 