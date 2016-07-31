# myNoiseCustom

Bringing custom settings to myNoise Web

Back in March 2015, I was a big fan of [myNoise][]. (I still am, but I'm not as avid a user
nowadays.) At that point, its iOS app was pretty new, but it had a feature the website didn't:
The ability to save multiple custom profiles for each generator. At some point I started diving
into the site's Javascript, and saw how I could save and apply a slider setting. Once I had that,
I only needed a way to summon these settings. Enter myNoiseCustom.

[myNoise]: http://mynoise.net

myNoiseCustom is a bookmarklet that allows the saving and loading of generator settings into the
browser's Local Storage. A setting can be saved for just one generator, or for all of them.

## Step 1: "Install" the bookmarklet

Copy the following Javascript into a new bookmark. You'll need to open either your bookmarks menu
or bookmarks toolbar and right-click to create a new bookmark to be able to paste this into the
location box.

```js
javascript: (function() {
    _my_script=document.createElement('SCRIPT');
    _my_script.type='text/javascript';
    _my_script.src='https://QuietMisdreavus.github.io/myNoiseCustom/myNoiseCustom.js?x='+(Math.random());
    document.getElementsByTagName('head')[0].appendChild(_my_script);
    })();
```

## Step 2: Run the script on a generator

The script will create a new menu on the right-hand column. From there you can choose to save a
setting to that generator or globally. Once a setting is saved, you can choose to load it by
clicking on its name, deleting it by clicking the "(X)" next to it, or replacing its settings by
clicking the "(Overwrite)" next to it.

## Limitations

* Right now, the script has no way to export settings to bring them to another computer.
* The script will create the menu section on the patron-only Magic Generators, but it currently
  doesn't look the greatest.
