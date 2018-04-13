## Demo
https://kai-ono.github.io/lazy-slider/dest/

## Browser support
* IE10 or greater
* Chrome latest
* Safari latest
* Firefox latest
* Android4.4 or greater
* iOS7 or greater

### Confirmed devices
| OS           | Model          | Default browser | Chrome | Safari |
| ------------ | -------------- | --------------- | ------ | ------ |
| Android4.0.4 | GALAXY S Ⅱ LTE | OK              | OK     | --     |
| Android4.1.2 | Xperia Z       | OK              | OK     | --     |
| Android4.4.2 | Xperia Z2      | OK              | OK     | --     |
| Android5.0   | Galaxy S5      | OK              | OK     | --     |
| Android6.0.1 | Galaxy S6      | OK              | OK     | --     |
| Android8.0.0 | Xperia XZ      | --              | OK     | --     |
| Android8.0.0 | Xperia XZ      | --              | OK     | --     |
| iOS5.1.1     | iPhone4S       | --              | --     | OK     |
| iOS6.0       | iPhone5        | --              | --     | OK     |
| iOS7.0       | iPhone5        | --              | --     | OK     |
| iOS8.1.1     | iPhone4S       | --              | --     | OK     |

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
