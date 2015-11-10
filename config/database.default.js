var config = {
	db : {
		uri : 'mongodb://user:passwor@server.com:27017/bitcannon'
	},
	redis : {
		port : 6379,
		host : '127.0.0.1',
		options : {}
	},
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
	specialIgnore : []
};


//Remove default ISO
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
for(var i=2; i<100; i++) {
  config.specialIgnore.push('.s'+pad(i,2));
  config.specialIgnore.push('.r'+pad(i,2));
  config.specialIgnore.push('.z'+pad(i,2));
  config.specialIgnore.push('.'+pad(i,2));
}
for(var i=2; i<1000; i++) {
  config.specialIgnore.push('.s'+pad(i,3));
  config.specialIgnore.push('.r'+pad(i,3));
  config.specialIgnore.push('.z'+pad(i,3));
  config.specialIgnore.push('.'+pad(i,3));
}


module.exports = config;
