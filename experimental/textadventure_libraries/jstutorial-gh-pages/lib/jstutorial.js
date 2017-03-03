var myCodeMirror = CodeMirror(document.body, {
	value: 'alert("hello world")',
	mode:  "javascript"
});

function editCodeBlock(evt){
	myCodeMirror.setValue(evt.target.nextSibling.innerHTML);
}

var codeblocks = Array.prototype.slice.call(document.querySelectorAll('.javascript'));
codeblocks.forEach(function(code){
	var button = document.createElement('button');
	button.innerHTML = 'Edit';
	button.addEventListener('click', editCodeBlock, false);
	code.parentNode.insertBefore(button, code);
});

function runCode(){
	eval(myCodeMirror.getValue());
}	

document.querySelector('.runCode').addEventListener('click', runCode, false);
