import './css/main.css';
const { load } = require("js-yaml");
var selectedTemplate;

document.addEventListener("DOMContentLoaded", async function (event) {
    window["globalLibraries"] = {
        yamlLoad: load
    };

    const data = await fetch("/templates.yaml");
    const templatesText = await data.text();
    const templates = await load(templatesText);
    console.log(templates)

    var selectTemplatesElement = document.getElementById('templates');
    for(var template of templates){
        var opt = document.createElement('option');
        opt.value = template.id;
        opt.innerHTML = template.label;
        opt.setAttribute('resources_url', template.resourcesUrl);
        selectTemplatesElement.appendChild(opt);
    }


    selectTemplatesElement.addEventListener('change', onChangeTemplate);
    document.getElementById('refreshButton').addEventListener("click", onClickRefresh); 
});


function onChangeTemplate(){
    console.log('You selected: ', this.options[this.selectedIndex]);
    selectedTemplate = this.options[this.selectedIndex];
    var resourcesUrl = selectedTemplate.getAttribute("resources_url");
    fetch(`${resourcesUrl}/dist/data.yaml?version=${generateUUID()}`)
    .then(function(response) {
      return response.text();
    })
    .then(function(rawYaml) {
        document.getElementById('yamlTextArea').value = rawYaml;
    });    
}

function onClickRefresh(){
    var imported = document.createElement('script');
    var resourcesUrl = selectedTemplate.getAttribute("resources_url");
    imported.src = `${resourcesUrl}/dist/render.js?version=${generateUUID()}`;
    document.head.appendChild(imported);
}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
