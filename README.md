## Demo
https://kai-ono.github.io/lazy-slider/dest/

## Browser support
* IE10 or greater
* Chrome latest
* Safari latest
* Firefox latest

## DOM example
```html
<link rel="stylesheet" type="text/css" href="css/lazy-slider.css"/>
<script type="text/javascript" src="js/lazy-slider.js"></script>
<div class="lazy-slider lazy-slider-style">
  <ul>
    <li><img src="1.jpg" /></li>
    <li><img src="2.jpg" /></li>
    <li><img src="3.jpg" /></li>
    <li><img src="4.jpg" /></li>
    <li><img src="5.jpg" /></li>
  </ul>
</div>
<script type="text/javascript">
  new LazySlider();
</script>
```

## Settings
| Option        | Type           | Default       | Desctiption   |
| ------------- | -------------- | ------------- | ------------- |
| class         | string         | 'lazy-loader' |               |
| auto          | boolean        | true          |               |
| interval      | integer        | 3000          |               |
| showItem      | integer        | 1             |               |
| slideNum      | integer        | showItem      |               |
| center        | boolean        | false         |               |
| loop          | boolean        | false         |               |
| btns          | boolean        | true          |               |
| navi          | boolean        | true          |               |
| swipe         | boolean        | true          |               |
