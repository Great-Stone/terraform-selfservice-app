/*
  Compute
*/
output "gcp_public_ip" {
    value = google_compute_instance.compute_instance.*.network_interface.0.access_config.0.nat_ip
}

/*
  Cloud SQL
*/
output "gcp_cloud_sql_db_ip" {
  value = google_sql_database_instance.instance.*.ip_address.0.ip_address
}

/*
  Cloud Storage Bucket
*/
output "gcp_cloud_storage_bucket_url" {
  value       = google_storage_bucket.storage_bucket.*.url
}