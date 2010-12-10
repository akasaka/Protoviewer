// (c) 2006-2008 Robert Cerny
if(typeof readFile=="undefined"){function readFile(filename){var reader=new java.io.BufferedReader(new java.io.FileReader(filename));var content="";var line=null;while((line=reader.readLine())!==null){content+=line+"\n";}
return content;}}
(function(){function load(filename){eval(readFile(filename));};CERNY.method(CERNY,"load",load);})();