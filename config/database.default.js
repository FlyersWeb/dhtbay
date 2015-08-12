var config = {
	db : {
		uri : 'mongodb://user:passwor@server.com:27017/bitcannon'
	},
	redis : {
		port : 6379,
		host : '127.0.0.1',
		options : {}
	},
        extToIgnore : [
          '.url', '.txt', '.ico', '.srt', '.gif', '.log', 
          '.nfo', '.cbr', '.ass', '.lnk', '.rtf', '.bc!', 
          '.bmp', '.m3u', '.mht', '.cue', '.sfv', '.diz',
          '.azw3', '.odt', '.chm', '.md5', '.idx', '.sub',
          '.ini', '.html', '.ssa', '.lit', '.xml', '.clpi',
          '.bup', '.ifo', '.htm', '.info', '.css', '.php', 
          '.js', '.jar', '.json', '.sha', '.docx', '.csv',
          '.scr'
        ]
};

module.exports = config;
