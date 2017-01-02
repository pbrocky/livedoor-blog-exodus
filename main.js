/**
 *  livedoor blog exodus main.js
 * 
 *  version 0.1.1
 * 
 * -- Tested browser --
 *    Firefox 3.6, Chrome5
 * 
 * -- history --
 * 
 *  v0.1.0
 *    1st release.
 * 
 * 
 */
	var lbExodus = lbExodus || {};
	lbExodus.linefeedCode = null;
	lbExodus.input = null;
	lbExodus.output = null;
	
	lbExodus.oldText = null;
	lbExodus.newUrl = null;
	lbExodus.newText = null;
 		
 	lbExodus.init = function(){
 		lbExodus.linefeedCode = $('#shadowTxtarea').val(); // linefeedCode = "\r\n" || "\n", depend on UA.
 		lbExodus.input = $( '#selectionInput');
 		lbExodus.output = $( '#selectionOutput').val( '');
 		
 		lbExodus.oldText = $( '#oldTextInput');
 		lbExodus.newUrl = $( '#newUrlInput');
 		lbExodus.newText = $( '#newTextOutput').val( '');
 
 		lbExodus.REG_IMG_URL = /https?:\/\/[a-z0-9-]+(\.[a-z0-9-]+)+(\/[\w-]+)*\/([\w-]*)\.(jpg|jpeg|gif|png|bmp)/igm;
 		lbExodus.IS_THUMBNAIL = /([\w]*)-s$/i;
 		
		delete lbExodus.init;
 	}
 	
	lbExodus.tab = function( id){
        $( '.current').removeClass( 'current');
        $( '#'+id).addClass( 'current');
	};

	lbExodus.selection = function(){
		var str = '' + lbExodus.input.val();
		if( str.length === 0){
			return;
		}
		
		var URL_ARRAY = [],
			FILENAME_ARRAY = [];

		str.replace( lbExodus.REG_IMG_URL, function( _all, tld, path, filename, filetype){
			if( FILENAME_ARRAY.indexOf( filename) === -1){
				URL_ARRAY.push( _all);
				FILENAME_ARRAY.push( filename);				
			}
		});
		
		var l = URL_ARRAY.length;
		if( l === 0 || l !== FILENAME_ARRAY.length){
			alert( 'miss' +l)
			return;
		}
		
		//画像がthumbnailの場合、LargeImageのURLがあれば、thumbnailのDownloadは不要
		var filename,
			i = 0;
		while( i<FILENAME_ARRAY.length){
			filename = FILENAME_ARRAY[ i];
			if(filename.match( lbExodus.IS_THUMBNAIL) && FILENAME_ARRAY.indexOf( filename.replace( lbExodus.IS_THUMBNAIL, '$1')) !== -1){
				URL_ARRAY.splice( i, 1);
				FILENAME_ARRAY.splice( i, 1);
			} else {
				i++;
			}
		}
		lbExodus.output.val( URL_ARRAY.join( lbExodus.linefeedCode));
		$( '#numImage').html( URL_ARRAY.length);
	};
	
	lbExodus.replaceUrl = function(){
		var oldText = '' + lbExodus.oldText.val(),
			newUrl = '' + lbExodus.newUrl.val();
		
		if( oldText.length === 0 || newUrl.length === 0){
			return;
		}
		
		var REG_USERCONTENT = /https:\/\/lh(\d)\.googleusercontent\.com/, //https://lh5.googleusercontent.com/-TIiZX37nX6k/S9oNj3tf7sI/AAAAAAAAGtY/3Xqv5a*****
			REG_PICASA_FIX = /\/s\d{2,4}-?\w?/; // /s1600-h/;
			NEW_URL_ARRAY = [],
			NEW_FILENAME_ARRAY = [],
			NEW_FILETYPE_ARRAY = [],
			OLD_URL_ARRAY = [],
			OLD_FILENAME_ARRAY = [];

		newUrl.replace( lbExodus.REG_IMG_URL, function( _all, tld, path, filename, filetype){
			if( !_all.match( REG_USERCONTENT)){
				return;
			}
			if( NEW_FILENAME_ARRAY.indexOf( filename) === -1){
				NEW_URL_ARRAY.push( _all.replace( filename +'.' +filetype, '').replace( REG_PICASA_FIX, ''));
				NEW_FILENAME_ARRAY.push( filename);
				NEW_FILETYPE_ARRAY.push( filetype);			
			}
		});


		oldText.replace( lbExodus.REG_IMG_URL, function( _all, tld, path, filename, filetype){
			OLD_URL_ARRAY.push( _all);
			OLD_FILENAME_ARRAY.push( filename);
		});			

		var url, filename, isThumbnail, i, _url, n=0, NOMATCH_ARRAY = [];
		while( OLD_URL_ARRAY.length > 0){
			url = OLD_URL_ARRAY.shift();
			filename = OLD_FILENAME_ARRAY.shift();
			
			isThumbnail = !!filename.match( lbExodus.IS_THUMBNAIL)
			filename = filename.replace( lbExodus.IS_THUMBNAIL, '$1');
			
			i = NEW_FILENAME_ARRAY.indexOf( filename);
			
			if( i > -1){
				_url = NEW_URL_ARRAY[ i];
				_url = _url +( isThumbnail === true ? 's288\/' : '') + NEW_FILENAME_ARRAY[ i] + '.' + NEW_FILETYPE_ARRAY[ i];
				_url = _url.replace( REG_USERCONTENT, 'http://3.bp.blogspot.com');
				oldText = oldText.replace( url, _url);
				n++;
			} else {
				NOMATCH_ARRAY.push( url);
			}
		}
		lbExodus.newText.val( oldText);
		$( '#numReplace').html( 'replace: ' +n + '<br \/>dont match url: ' + NOMATCH_ARRAY.length +'<br \/>' +NOMATCH_ARRAY.join( '<br \/>'));
	}

	$(document).ready( lbExodus.init);
