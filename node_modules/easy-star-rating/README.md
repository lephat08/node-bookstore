# star-rating

Simple star-rating web component built using [Easy Element](https://www.npmjs.com/package/easy-element).

Clicking on a star, unless the `read-only` attribute is present, will fill in the appropriate number of stars and dispatch a `change` event with a `detail.rating` of the new rating. Clicking the same star twice clears the rating to zero.



![demo screenshot](https://raw.githubusercontent.com/Pilatch/star-rating/master/readme-stuff/demo-screenshot.png)

## Install

```bash
yarn
```

## Run the demo

```bash
yarn start
```

See the demo page at `dist/index.class.html` for how it works.

## Develop

```bash
yarn dev
```

... And edit the files in the `src` folder.

Easy Element will rebuild your web component(s) to the `dist` folder, then your browser should refresh the demo page automatically. Your terminal will report build failures due to HTML/CSS/JS syntax errors.

Note that you have two demo pages: `dist/index.class.html` for new browsers, and `dist/index.es5.html` for a wider range of browser support. By default your browser will open the page which uses class-based JavaScript output.
