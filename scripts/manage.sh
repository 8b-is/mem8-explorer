#!/bin/bash

# ##############################################################################
# # manage.sh - The Grand Orchestrator for the Mem8 Explorer! 🚀             #
# ##############################################################################
# # This script is your one-stop-shop for managing the Mem8 Explorer project.  #
# # It's like a Swiss Army knife, but for code, and probably less likely to    #
# # get confiscated by airport security.                                     #
# #                                                                            #
# # Now powered by Svelte 5! Because static files are so 2024...              #
# #                                                                            #
# # Brought to you by Aye & Hue, with special thanks to Trish for keeping our  #
# # spirits (and spreadsheets) high!                                         #
# ##############################################################################

# --- Script's Own Location (for robust pathing) ---
# This ensures we can find files relative to where the script actually lives.
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

# --- Configuration Gloriosa ---
PROJECT_NAME="Mem8 Explorer (Svelte Edition)"
# Paths are now relative to the SCRIPT_DIR's parent (i.e., mem8-explorer directory)
PROJECT_ROOT_DIR="${SCRIPT_DIR}/.." 
PACKAGE_JSON="${PROJECT_ROOT_DIR}/package.json"
NODE_MODULES="${PROJECT_ROOT_DIR}/node_modules"

# --- Color Me Impressed (Shell Colors) ---
# Because life's too short for monochrome terminals. Trish agrees.
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color, for when we're feeling serious (rarely).

# --- Helper Functions: The Unsung Heroes ---

# Function to echo a fancy header. Because presentation matters.
print_header() {
    echo -e "${PURPLE}=======================================================${NC}"
    echo -e "${PURPLE}🚀 ${CYAN}$1 ${PURPLE}🚀${NC}"
    echo -e "${PURPLE}=======================================================${NC}"
}

# Function to echo success. Green means go, go, go!
print_success() {
    echo -e "${GREEN}✅ Success:${NC} $1"
}

# Function to echo a warning. Yellow like a banana peel - watch out!
print_warning() {
    echo -e "${YELLOW}⚠️ Warning:${NC} $1"
}

# Function to echo an error. Red alert! Shields up!
print_error() {
    echo -e "${RED}❌ Error:${NC} $1"
}

# Function to check if pnpm is installed
check_pnpm() {
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm is not installed! Please install it first."
        echo -e "${CYAN}Install with: ${YELLOW}npm install -g pnpm${NC}"
        echo -e "${CYAN}Or visit: ${YELLOW}https://pnpm.io/installation${NC}"
        return 1
    fi
    return 0
}

# Function to check if dependencies are installed
check_dependencies() {
    if [ ! -d "$NODE_MODULES" ]; then
        print_warning "Dependencies not installed. Installing now..."
        install_dependencies
    fi
}

# --- Core Functions: The Main Event ---

# Function to install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    check_pnpm || return 1
    
    cd "$PROJECT_ROOT_DIR"
    echo -e "${CYAN}Running pnpm install...${NC}"
    pnpm install
    
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully!"
    else
        print_error "Failed to install dependencies!"
        return 1
    fi
}

# Function to start the dev server
start_project() {
    print_header "Starting ${PROJECT_NAME} Dev Server"
    check_pnpm || return 1
    check_dependencies
    
    cd "$PROJECT_ROOT_DIR"
    echo -e "${CYAN}Warming up the flux capacitors...${NC}"
    sleep 1
    echo -e "${GREEN}Aligning the memory crystals...${NC}"
    sleep 1
    echo -e "${PURPLE}Engaging Svelte hyperdrive!${NC}"
    
    print_success "Starting dev server on http://localhost:3000"
    pnpm run dev
}

# Function to build the project
build_project() {
    print_header "Building ${PROJECT_NAME}"
    check_pnpm || return 1
    check_dependencies
    
    cd "$PROJECT_ROOT_DIR"
    echo -e "${CYAN}Compiling wave patterns into static assets...${NC}"
    pnpm run build
    
    if [ $? -eq 0 ]; then
        print_success "Build complete! Check the 'dist' folder."
        echo -e "${BLUE}You can preview the build with: ${YELLOW}pnpm run preview${NC}"
    else
        print_error "Build failed! Check the error messages above."
    fi
}

# Function to preview the build
preview_project() {
    print_header "Previewing ${PROJECT_NAME} Build"
    check_pnpm || return 1
    
    if [ ! -d "${PROJECT_ROOT_DIR}/dist" ]; then
        print_warning "No build found. Building first..."
        build_project
    fi
    
    cd "$PROJECT_ROOT_DIR"
    print_success "Starting preview server..."
    pnpm run preview
}

# Function to run type checking
check_project() {
    print_header "Type Checking ${PROJECT_NAME}"
    check_pnpm || return 1
    check_dependencies
    
    cd "$PROJECT_ROOT_DIR"
    echo -e "${CYAN}Running Svelte type checker...${NC}"
    pnpm run check
    
    if [ $? -eq 0 ]; then
        print_success "No type errors found!"
    else
        print_warning "Type errors detected. Please fix them for optimal performance."
    fi
}

# Function to clean the project
clean_project() {
    print_header "Cleaning ${PROJECT_NAME}"
    
    echo -e "${CYAN}Removing build artifacts...${NC}"
    rm -rf "${PROJECT_ROOT_DIR}/dist"
    rm -rf "${PROJECT_ROOT_DIR}/.svelte-kit"
    
    print_success "Project cleaned!"
}

# Function to build Docker image
docker_build() {
    print_header "Building Docker Image"
    
    cd "$PROJECT_ROOT_DIR"
    echo -e "${CYAN}Building Docker image for ${PROJECT_NAME}...${NC}"
    docker build -t mem8-explorer:latest .
    
    if [ $? -eq 0 ]; then
        print_success "Docker image built successfully!"
    else
        print_error "Failed to build Docker image!"
        return 1
    fi
}

# Function to run Docker container
docker_run() {
    print_header "Running Docker Container"
    
    echo -e "${CYAN}Starting ${PROJECT_NAME} in Docker...${NC}"
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        print_success "Container started! Access at http://localhost:3000"
    else
        print_error "Failed to start Docker container!"
        return 1
    fi
}

# Function to stop Docker container
docker_stop() {
    print_header "Stopping Docker Container"
    
    echo -e "${CYAN}Stopping ${PROJECT_NAME} container...${NC}"
    docker-compose down
    
    if [ $? -eq 0 ]; then
        print_success "Container stopped!"
    else
        print_error "Failed to stop Docker container!"
        return 1
    fi
}

# --- The Grand Menu: Choose Your Destiny! ---
show_menu() {
    print_header "${PROJECT_NAME} Management Console"
    echo -e "${CYAN}What adventure shall we embark on today, Captain Hue?${NC}"
    echo -e "  ${YELLOW}1)${NC} ${GREEN}Dev${NC} Start development server"
    echo -e "  ${YELLOW}2)${NC} ${GREEN}Build${NC} Create production build"
    echo -e "  ${YELLOW}3)${NC} ${GREEN}Preview${NC} Preview production build"
    echo -e "  ${YELLOW}4)${NC} ${GREEN}Install${NC} Install dependencies"
    echo -e "  ${YELLOW}5)${NC} ${GREEN}Check${NC} Run type checking"
    echo -e "  ${YELLOW}6)${NC} ${GREEN}Clean${NC} Remove build artifacts"
    echo -e "${PURPLE}--- Docker Operations ---${NC}"
    echo -e "  ${YELLOW}7)${NC} ${GREEN}Docker Build${NC} Build Docker image"
    echo -e "  ${YELLOW}8)${NC} ${GREEN}Docker Run${NC} Run in Docker container"
    echo -e "  ${YELLOW}9)${NC} ${GREEN}Docker Stop${NC} Stop Docker container"
    echo -e "${PURPLE}-------------------------------------------------------${NC}"
    echo -e "  ${YELLOW}q)${NC} ${RED}Quit${NC} (Return to the mundane world)"
    echo -e "${PURPLE}-------------------------------------------------------${NC}"
}

# --- Main Logic: Let the Games Begin! ---
if [[ "$1" == "" ]]; then
    while true; do
        show_menu
        read -r -p "$(echo -e "${CYAN}Enter your command [1-9, q]: ${NC}")" choice
        echo "" # Newline for readability

        case "$choice" in
            1|dev|start)
                start_project
                ;;
            2|build)
                build_project
                ;;
            3|preview)
                preview_project
                ;;
            4|install)
                install_dependencies
                ;;
            5|check)
                check_project
                ;;
            6|clean)
                clean_project
                ;;
            7|docker-build)
                docker_build
                ;;
            8|docker-run)
                docker_run
                ;;
            9|docker-stop)
                docker_stop
                ;;
            q|quit)
                echo -e "${BLUE}Farewell, Captain! May your code be bug-free and your coffee strong.${NC}"
                exit 0
                ;;
            *)
                print_error "Invalid choice, Captain! That's not on the map."
                echo -e "${CYAN}Please select a valid option from the menu.${NC}"
                ;;
        esac
        echo "" # Newline for readability
    done
else
    # Allow direct command execution, e.g., ./manage.sh start
    case "$1" in
        dev|start)
            start_project
            ;;
        build)
            build_project
            ;;
        preview)
            preview_project
            ;;
        install)
            install_dependencies
            ;;
        check)
            check_project
            ;;
        clean)
            clean_project
            ;;
        docker-build)
            docker_build
            ;;
        docker-run)
            docker_run
            ;;
        docker-stop)
            docker_stop
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Usage: $0 [dev|build|preview|install|check|clean|docker-build|docker-run|docker-stop]"
            exit 1
            ;;
    esac
fi

echo -e "${PURPLE}Aye, Aye! Script complete. Time for a celebratory byte? 🍪${NC}"
exit 0