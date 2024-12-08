# Publiqate HTML

Generate HTML file plugin for `Publiqate`

## Build and Installation

Clone this repository. Navigate to the `plugins -> html` folder and run:

```bash
npm run build
```

Once the build process is complete the compiled code will be available in `plugins -> html -> dist` folder.

Copy the content of the `dist` folder somewhere on the server, where `Publiqate` is running and specify the location from where `Publiqate` will load the plugin.

Once the config is set either restart the `Publiqate` service or visit the admin UI and press "Refresh config".

Example config:

```yaml
...
plugins:
  - c:\path\to\html\plugin\dist\index.js
...
notifications:
  - type: Stream
    ...
    callbacks:
      - type: html
        details:
          template: c:\path\to\template.handlebars # see Templates section for details
          path: c:\path\to\where\to\store\index.html
          type: handlebars # or ejs, pug, mustache
...
```

## Options

- `template` - full path to the template to use (see `Templates` section for details)
- `path`- full path to where to store the compiled plugin. The path must include the file name as well
- `type` - optional. defaults to `handlebars`. Which template engine to use to render the template (see the section below)

## Templates

The plugin support 4 template engines:

- [ejs](https://ejs.co/)
- [handlebars](https://handlebarsjs.com/guide/) - **default**
- [pug](https://pugjs.org/api/getting-started.html)
- [mustache](https://github.com/janl/mustache.js)

For each template engine error log entry will be generated if the template fails to compile/render.

Examples how to render list of names for all entities in the notification for each template engine:

### [EJS](https://ejs.co/)

```ejs
<ul><% entities.forEach((entity,index) => {%>
  <li><%= entity.details.name %></li><% }) %>
</ul>
```

### [Handlebars](https://handlebarsjs.com/guide/)

```handlebars
<ul>
  {{#each entities}}
    <li>{{this.details.name}}</li>
  {{/each}}
</ul>
```

### [Pug](https://pugjs.org/api/getting-started.html)

```pug
ul
  each n in entities
    li= n.details.name
```

### [Mustache](https://github.com/janl/mustache.js)

```mustache
<ul>
  {{#entities}}
    <li>{{details.name}}</li>
  {{/entities}}
</ul>
```
