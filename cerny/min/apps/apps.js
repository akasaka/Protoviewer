// (c) 2006-2008 Robert Cerny
CERNY.namespace("apps");CERNY.require("CERNY.apps");(function(){var method=CERNY.method;var signature=CERNY.signature;var logger=CERNY.Logger("CERNY.apps");CERNY.apps.logger=logger;function read(filename){var reader=new java.io.BufferedReader(new java.io.FileReader(filename));var content="";var line=null;while((line=reader.readLine())!==null){content+=line+"\n";}
return content;}
signature(read,"string","string");method(CERNY.apps,"read",read);function write(filename,content){var writer=new java.io.BufferedWriter(new java.io.FileWriter(filename));writer.write(content,0,content.length);writer.close();}
signature(write,"string","string","string");method(CERNY.apps,"write",write);})();