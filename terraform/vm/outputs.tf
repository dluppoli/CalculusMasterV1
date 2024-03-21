output "public_ip_address" {
    value = google_compute_instance.default.network_interface.0.access_config.0.nat_ip
}

output "private_ip_address" {
    value = google_compute_instance.default.network_interface.0.network_ip 
}