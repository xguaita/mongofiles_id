# mongofiles_id
Node.js CLI utility for putting and getting files from MongoDB GridFS by ***_id*** instead by *filename*  

### Supported Commands
- [x] list
- [x] search
- [x] get
- [x] delete
- [x] put

### Usage
```
mongofiles_id [options] [command]

Commands:

  list [prefix]  
     Lists the files in the GridFS store. Optionally limit the list of  
     returned items to files that names begin with [prefix]

  search <string>  
     Lists the files in the GridFS store with names that match any  
     portion of <string>

  get <_id> <filename>  
     Copy the file specified by <_id> from GridFS storage to the local  
     file system as <filename>

  put <filename> <_id>  
     Copy <filename> file from the local file system into GridFS storage  
     with this <_id>. Without the --replace option if the _id exists raises an error

  delete <_id>  
     Delete the specified file by <_id> from GridFS storage


Options:

  -h, --help                     output usage information  
  -V, --version                  output the version number  
  --host [hostname]              Hostname. Default localhost  
  --port [port]                  Port. Default 27017  
  --database <database>          Specifies the name of the database to work with  
  --gridfsnamespace [prefix]     The gridfs namespace (prefix) to work with. Default fs  
  -u, --username [username]      Username  
  -p, --password [password]      Password  
  --content_type [content_type]  Mime type of the file. Default binary/octet-stream  
  --replace                      Replace file with PUT  
```

## License
MIT
