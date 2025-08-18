# Elektro skola Niksic

Niksic power

## Start local server:

As Virgin 
```sh
node server.js
```

As Chad
```config
server {
    ...
    location / {
        ...
        try_files $uri /index.html;
    }
}
```

As Gigachad
```C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>
#include <dirent.h>
#include <sys/stat.h>

#define PORT 8080
#define BUFFER_SIZE 4096

const char* get_mime(const char* path) {
    const char* ext = strrchr(path, '.');
    if (!ext) return "application/octet-stream";
    if (strcmp(ext, ".html") == 0) return "text/html";
    if (strcmp(ext, ".css") == 0) return "text/css";
    if (strcmp(ext, ".js") == 0) return "application/javascript";
    if (strcmp(ext, ".png") == 0) return "image/png";
    if (strcmp(ext, ".jpg") == 0) return "image/jpeg";
    if (strcmp(ext, ".gif") == 0) return "image/gif";
    if (strcmp(ext, ".svg") == 0) return "image/svg+xml";
    return "application/octet-stream";
}

void get_local_ip(char* buffer) {
    struct addrinfo hints, *res, *p;
    gethostname(buffer, 128);
    memset(&hints, 0, sizeof hints);
    hints.ai_family = AF_INET;
    hints.ai_socktype = SOCK_STREAM;
    getaddrinfo(buffer, NULL, &hints, &res);
    for(p = res; p != NULL; p = p->ai_next) {
        struct sockaddr_in *ipv4 = (struct sockaddr_in *)p->ai_addr;
        strcpy(buffer, inet_ntoa(ipv4->sin_addr));
        break;
    }
    freeaddrinfo(res);
}

int main() {
    int server_fd, client_fd;
    struct sockaddr_in addr;
    char buffer[BUFFER_SIZE];
    char local_ip[128];

    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(PORT);

    bind(server_fd, (struct sockaddr*)&addr, sizeof(addr));
    listen(server_fd, 5);

    get_local_ip(local_ip);
    printf("Local Server running on:\n > http://localhost:%d\n > http://%s:%d\n", PORT, local_ip, PORT);

    while(1) {
        client_fd = accept(server_fd, NULL, NULL);
        read(client_fd, buffer, BUFFER_SIZE);

        char path[512];
        sscanf(buffer, "GET %s ", path);
        if (strcmp(path, "/") == 0) strcpy(path, "/index.html");

        FILE *f = fopen(path + 1, "rb");
        if (!f) f = fopen("index.html", "rb");

        fseek(f, 0, SEEK_END);
        long len = ftell(f);
        fseek(f, 0, SEEK_SET);

        char *content = malloc(len);
        fread(content, 1, len, f);
        fclose(f);

        const char* mime = get_mime(path);
        sprintf(buffer, "HTTP/1.1 200 OK\nContent-Type: %s\nContent-Length: %ld\n\n", mime, len);
        write(client_fd, buffer, strlen(buffer));
        write(client_fd, content, len);
        free(content);
        close(client_fd);
    }

    close(server_fd);
    return 0;
}
```
