#!/bin/bash

# DNS Verification Script for Vercel Deployment
# This script helps verify DNS configuration for your custom domain

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required commands
check_dependencies() {
    local missing_deps=()
    
    if ! command_exists dig; then
        missing_deps+=("dig (dnsutils)")
    fi
    
    if ! command_exists curl; then
        missing_deps+=("curl")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing required dependencies: ${missing_deps[*]}"
        print_info "Install them using:"
        print_info "  Ubuntu/Debian: sudo apt-get install dnsutils curl"
        print_info "  macOS: brew install bind curl"
        print_info "  Windows: Use WSL or install via package manager"
        exit 1
    fi
}

# Function to check A record
check_a_record() {
    local domain=$1
    print_info "Checking A record for $domain..."
    
    local result=$(dig +short "$domain" A)
    
    if [ -z "$result" ]; then
        print_error "No A record found for $domain"
        return 1
    else
        print_success "A record found: $result"
        
        # Check if it points to Vercel's IP
        if echo "$result" | grep -q "76.76.21.21\|76.76.21.22\|76.76.21.23\|76.76.21.24"; then
            print_success "IP address points to Vercel"
        else
            print_warning "IP address may not point to Vercel. Verify in your Vercel dashboard."
        fi
    fi
}

# Function to check CNAME record
check_cname_record() {
    local domain=$1
    print_info "Checking CNAME record for $domain..."
    
    local result=$(dig +short "$domain" CNAME)
    
    if [ -z "$result" ]; then
        print_warning "No CNAME record found for $domain"
        return 1
    else
        print_success "CNAME record found: $result"
        
        # Check if it points to Vercel
        if echo "$result" | grep -q "vercel-dns.com\|vercel.app"; then
            print_success "CNAME points to Vercel"
        else
            print_warning "CNAME may not point to Vercel. Verify in your Vercel dashboard."
        fi
    fi
}

# Function to check HTTP response
check_http_response() {
    local url=$1
    print_info "Checking HTTP response for $url..."
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -L "$url" 2>/dev/null)
    
    if [ "$status_code" = "200" ]; then
        print_success "HTTP 200 OK - Site is accessible"
    elif [ "$status_code" = "301" ] || [ "$status_code" = "302" ]; then
        print_warning "HTTP $status_code - Redirect detected"
    else
        print_error "HTTP $status_code - Site may not be accessible"
    fi
    
    # Check Content-Type header
    local content_type=$(curl -s -I -L "$url" 2>/dev/null | grep -i "content-type" | head -1)
    if echo "$content_type" | grep -q "text/html"; then
        print_success "Content-Type is text/html - Correct MIME type"
    else
        print_error "Content-Type is not text/html: $content_type"
        print_error "This may cause download issues!"
    fi
}

# Function to check SSL certificate
check_ssl() {
    local domain=$1
    print_info "Checking SSL certificate for $domain..."
    
    if command_exists openssl; then
        local ssl_info=$(echo | openssl s_client -servername "$domain" -connect "$domain":443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
        
        if [ -n "$ssl_info" ]; then
            print_success "SSL certificate is valid"
            echo "$ssl_info" | while read line; do
                print_info "  $line"
            done
        else
            print_error "Unable to verify SSL certificate"
        fi
    else
        print_warning "openssl not found, skipping SSL check"
    fi
}

# Function to check DNS propagation
check_dns_propagation() {
    local domain=$1
    print_info "Checking DNS propagation status..."
    print_info "Visit https://dnschecker.org/#A/$domain to check global propagation"
}

# Main function
main() {
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║          Vercel DNS Verification Script                       ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Check dependencies
    check_dependencies
    
    # Get domain from user or argument
    if [ -z "$1" ]; then
        read -p "Enter your domain name (e.g., example.com): " DOMAIN
    else
        DOMAIN=$1
    fi
    
    # Remove protocol if present
    DOMAIN=$(echo "$DOMAIN" | sed 's|^https\?://||' | sed 's|/$||')
    
    echo ""
    print_info "Verifying DNS configuration for: $DOMAIN"
    echo ""
    
    # Check root domain
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "ROOT DOMAIN CHECK: $DOMAIN"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    check_a_record "$DOMAIN"
    check_cname_record "$DOMAIN"
    echo ""
    
    # Check www subdomain
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "WWW SUBDOMAIN CHECK: www.$DOMAIN"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    check_cname_record "www.$DOMAIN"
    echo ""
    
    # Check HTTP response
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "HTTP RESPONSE CHECK"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    check_http_response "https://$DOMAIN"
    echo ""
    
    # Check SSL
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "SSL CERTIFICATE CHECK"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    check_ssl "$DOMAIN"
    echo ""
    
    # DNS propagation info
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "DNS PROPAGATION CHECK"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    check_dns_propagation "$DOMAIN"
    echo ""
    
    # Summary
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                         SUMMARY                                ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    print_info "Verification complete!"
    print_info "If you see any errors above, please refer to TROUBLESHOOTING.md"
    print_info "for detailed resolution steps."
    echo ""
}

# Run main function
main "$@"
