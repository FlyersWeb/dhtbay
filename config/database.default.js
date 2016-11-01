var config = {
  db : {
    uri : 'mongodb://user:passwor@mongo:27017/bitcannon'
  },
  redis : {
    port : 6379,
    host : 'redis',
    options : {}
  },
  aria2 : {
    host: 'aria2',
    port: 6800,
    secure: false
  },
  trackers: [
    "udp://tracker.openbittorrent.com:80/announce",
    "udp://tracker.piratepublic.com:1337/announce"
  ],
  limitExt : 8,
  extToIgnore : [
    '.url', '.txt', '.ico', '.srt', '.gif', '.log', 
    '.nfo', '.ass', '.lnk', '.rtf', '.bc!', 
    '.bmp', '.m3u', '.mht', '.cue', '.sfv', '.diz',
    '.azw3', '.odt', '.chm', '.md5', '.idx', '.sub',
    '.ini', '.html', '.ssa', '.lit', '.xml', '.clpi',
    '.bup', '.ifo', '.htm', '.info', '.css', '.php', 
    '.js', '.jar', '.json', '.sha', '.docx', '.csv',
    '.scr', '.inf', '.hdr', '.prq', '.isn', '.inx', '.tpl', 
    '.aco', '.opa', '.dpc', '.qdl2', '.acf', '.cdx', 
    '.iwd', '.ff', '.tmp', '.asi', '.flt', '.cfg', 
    '.tdl', '.tta', '.ape', '.btn', '.sig', '.sql', '.db', 
    '.zdct', '.bak', '.fxp', '.nxp', '.nsk', '.256', 
    '.mpls', '.clpi', '.bdmv', '.cdd', '.dbf', 
    '.vmx', '.vmsd', '.vmxf', '.nvram'
  ],
  extToCateg : {
    'Picture' : ['.png', '.jpeg', '.jpg'],
    'Program' : ['.exe', '.dll', '.msi', '.jar'],
    'ISO'   : ['.rar', '.01', '.001', 'r01', 'r001', 'z01', 'z001', '.iso', '.zip', '.dmg', '.tgz', '.gz', '.chd', '.7z', '.cab', '.apk', '.cdr', '.wbfs', '.dat', '.rar', '.lzma', '.mds', '.gho', '.ima', '.nrg', '.pkg', '.b5i', '.mdx', '.isz', '.vmdk'],
    'Book' : ['.epub', '.pdf', '.cbz', '.cbr', '.cb7', '.cba', '.cbt', '.djvu', '.fb2', '.mobi', '.doc'],
    'Audio' : ['.flac', '.mp3', '.m4p', '.m4r', '.m4a', '.m4b', '.ape', '.wma', '.ogg', '.dsf', '.wav'],
    'Video' : ['.mp4', '.mkv', '.3gp', '.flv', '.f4v', '.avi', '.rm', '.rmvb', '.wmv', '.mov', '.mpg', '.mpeg', '.ts', '.m2ts', '.m4v', '.asf', '.vob', '.divx', '.srt'],
  }
};

module.exports = config;
