#!/bin/bash

# Vercel Cache Clearing Script
# This script helps clear local and Vercel caches and force a fresh deployment

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main function
main() {
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║          Vercel Cache Clearing Script                         ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Get project directory
    PROJECT_DIR=$(pwd)
    print_info "Working directory: $PROJECT_DIR"
    echo ""
    
    # Step 1: Clear local node_modules
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "STEP 1: Clearing local node_modules"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ -d "node_modules" ]; then
        print_info "Removing node_modules..."
        rm -rf node_modules
        print_success "node_modules removed"
    else
        print_info "No node_modules directory found, skipping..."
    fi
    echo ""
    
    # Step 2: Clear package-lock.json
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "STEP 2: Clearing package-lock.json"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ -f "package-lock.json" ]; then
        print_info "Removing package-lock.json..."
        rm -f package-lock.json
        print_success "package-lock.json removed"
    else
        print_info "No package-lock.json found, skipping..."
    fi
    echo ""
    
    # Step 3: Clear build artifacts
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "STEP 3: Clearing build artifacts"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ -d "dist" ]; then
        print_info "Removing dist directory..."
        rm -rf dist
        print_success "dist directory removed"
    else
        print_info "No dist directory found, skipping..."
    fi
    echo ""
    
    # Step 4: Clear Vercel cache directory
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "STEP 4: Clearing Vercel cache directory"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ -d ".vercel" ]; then
        print_info "Removing .vercel directory..."
        rm -rf .vercel
        print_success ".vercel directory removed"
    else
        print_info "No .vercel directory found, skipping..."
    fi
    echo ""
    
    # Step 5: Reinstall dependencies
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "STEP 5: Reinstalling dependencies"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ -f "package.json" ]; then
        print_info "Running npm install..."
        if npm install; then
            print_success "Dependencies installed"
        else
            print_error "Failed to install dependencies!"
            print_error "Check your package.json for errors or network connectivity"
            exit 1
        fi
    else
        print_error "No package.json found!"
        exit 1
    fi
    echo ""
    
    # Step 6: Rebuild
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "STEP 6: Rebuilding project"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if grep -q '"build"' package.json; then
        print_info "Running npm run build..."
        if npm run build; then
            print_success "Build completed"
        else
            print_error "Build failed!"
            print_error "Check build logs above for specific errors"
            print_info "Common issues: missing environment variables, TypeScript errors"
            exit 1
        fi
    else
        print_warning "No build script found in package.json"
    fi
    echo ""
    
    # Step 7: Force deployment (if Vercel CLI is available)
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "STEP 7: Deploying to Vercel"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if command_exists vercel; then
        read -p "Deploy to Vercel now? (y/n): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Deploying to Vercel with --force flag..."
            vercel --force --prod
            print_success "Deployment initiated"
        else
            print_info "Skipping deployment. You can manually deploy with: vercel --force --prod"
        fi
    else
        print_warning "Vercel CLI not found"
        print_info "Install with: npm install -g vercel"
        print_info "Then run: vercel --force --prod"
    fi
    echo ""
    
    # Summary
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                         SUMMARY                                ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    print_success "Cache clearing completed!"
    print_info "Next steps:"
    print_info "  1. Commit and push your changes to trigger automatic deployment"
    print_info "  2. Or manually deploy with: vercel --force --prod"
    print_info "  3. Monitor deployment in Vercel dashboard"
    echo ""
    print_info "If issues persist, see TROUBLESHOOTING.md for more help"
    echo ""
}

# Run main function
main "$@"
