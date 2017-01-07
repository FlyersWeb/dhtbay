var config = {
  db : {
    uri : 'mongodb://mongo:27017/bitcannon'
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
    "udp://tracker.coppersurfer.tk:6969/announce",
    "udp://tracker.leechers-paradise.org:6969/announce",
    "udp://tracker.zer0day.to:1337/announce",
    "http://tracker.opentrackr.org:1337/announce",
    "udp://tracker.opentrackr.org:1337/announce",
    "udp://p4p.arenabg.com:1337/announce",
    "http://p4p.arenabg.com:1337/announce",
    "udp://9.rarbg.com:2710/announce",
    "http://explodie.org:6969/announce",
    "udp://explodie.org:6969/announce",
    "udp://public.popcorn-tracker.org:6969/announce",
    "udp://tracker.internetwarriors.net:1337/announce",
    "http://tracker.dler.org:6969/announce",
    "http://tracker1.wasabii.com.tw:6969/announce",
    "http://tracker.mg64.net:6881/announce",
    "http://mgtracker.org:6969/announce",
    "udp://tracker.mg64.net:6969/announce",
    "udp://mgtracker.org:2710/announce",
    "http://tracker2.wasabii.com.tw:6969/announce",
    "http://tracker.tiny-vps.com:6969/announce"
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
