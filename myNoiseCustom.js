//myNoise Custom - bringing multiple custom generators into your Local Storage
//written in a fever dream by Bryan 'icesoldier' Mitchell in March 2015

//todo: export/import
//todo: toggle option visibility (delete, overwrite) instead of showing all the time
//todo: make menu look less janky on magic gens

(function(){
	function getSettings(genName) {
		var ret = {};
		var names = localStorage.getItem('MNC.' + genName);
		if (names) {
			var stor = names.split(',');
			stor.forEach(function(element, index, array) {
				var values = localStorage.getItem('MNC.' + genName + element).split(',');
				ret[element] = values;
			});
		}
		return ret;
	}

	function setSettings(genName, settings) {
		var customNames = Object.keys(settings);
		localStorage.setItem('MNC.' + genName, customNames.toString());
		customNames.forEach(function(element, index, array) {
			localStorage.setItem('MNC.' + genName + element, settings[element].toString());
		});
	}

	function customsList(genName) {
		var names = localStorage.getItem('MNC.' + genName);
		if (!names) return new Array();
		else return names.split(',');
	}

	function saveCustom(genName, customName) {
		var customs = getSettings(genName);
		getCurrentLevelsFromSliders();
		customs[customName] = currentLevel;
		setSettings(genName, customs);

		//Set the message text
		$('#msg').text(decodeURIComponent(customName));
	}

	function removeCustom(genName, customName) {
		var oldCustoms = getSettings(genName);
		var customs = {};
		customsList(genName).forEach(function(element, index, array) {
			if (element !== customName) {
				customs[element] = oldCustoms[element];
			}
		});
		setSettings(genName, customs);
		localStorage.removeItem('MNC.' + genName + customName);
	}

	function addMenuCustom(genName, customName, index, elem) {
		var link = $('<span></span>').addClass('actionlink').addClass('mnc' + index);
		link.text(decodeURIComponent(customName));
		link.on('click', function() {
			var s = getSettings(genName)[customName];
			setPreset(s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9], $(this).text());
		});
		elem.append(link);

		var rem = $('<span></span>').addClass('actionlink').addClass('mnc' + index);
		rem.text('(X)');
		rem.on('click', function() {
			if (window.confirm('Delete "' + decodeURIComponent(customName) + '"?')) {
				var totalCustoms = customsList(genName).length;
				removeCustom(genName, customName);
				$('p.' + genName + ' .mnc' + index).remove();

				//shift the class numbering, so insertion will still work
				for (i = index + 1; i < totalCustoms; i++) {
					$('p.' + genName + ' .mnc' + i).removeClass('mnc' + i).addClass('mnc' + (i - 1));
				}
			}
		});
		elem.append(' ').append(rem);

		var upd = $('<span></span>').addClass('actionlink').addClass('mnc' + index);
		upd.text('(Overwrite)');
		upd.on('click', function () {
			if (window.confirm('Save current settings to "' + decodeURIComponent(customName) + '"?')) {
				saveCustom(genName, customName);
			}
		});

		elem.append(' ').append(upd);

		var lineBreak = $('<br/>').addClass('mnc' + index);
		elem.append(lineBreak);
	}

	function appendCustoms(elem, genName, headerText) {
		var customs = getSettings(genName);

		var para = $('<p></p>').addClass(genName);
		para.css('padding-bottom', '0px');

		var header = $('<h2></h2>');
		header.text(headerText);
		para.append(header);

		customsList(genName).forEach(function(element, index, array) {
			addMenuCustom(genName, element, index, para);
		});

		var makeNew = $('<span></span>').addClass('actionlink');
		makeNew.text('Save Current Settings');
		makeNew.on('click', function() {
			var settingName = prompt('Name your new setting:', 'Custom Noise');
			if (settingName) {
				var customs = customsList(genName);
				if (!customs.some(function(element) { element === settingName; })) {
					var index = customs.length;
					$(this).detach();
					addMenuCustom(genName, settingName, index, para);
					para.append($(this));
				}
				saveCustom(genName, settingName);
			}
		});
		para.append(makeNew);

		elem.append(para);
	}

	function drawMenu(genName, menu) {
		appendCustoms(menu, genName, 'Settings for this generator:');

		appendCustoms(menu, 'mncGlobal', 'Settings for every generator:');
	}

	function menuColumn() {
		//two column page? use the right column
		var col = $('.col2');

		//three column page? use the right column
		if (col.length === 0)
			col = $('.colC');

		//one column page? create a second column and use that
		if (col.length === 0) {
			var content = $(document.createElement('div'));
			content.addClass('col1');

			$('div.allContent').prepend(content);
			content.append('div.allContent div.content');

			col = $(document.createElement('div'));
			col.addClass('col2');
			col.insertAfter('div.allContent div.col1');
		}

		return col;
	}

	function init() {
		if (document.documentURI.search('mynoise.net/NoiseMachines/') === -1) {
			//don't want to mess with anything that's not a generator
			return;
		}

		if (!localStorage) {
			alert('Your browser does not seem to support HTML Local Storage. This script cannot save custom settings without that available.');
			return;
		}

		var genName = $('#bgimage').css('background-image').match('mynoise.net/Data/(.*)/')[1];

		if (!genName) {
			alert("The page's layout has changed - this script needs to be updated.");
			return;
		}

		var menu = $('#mnc');

		if (menu.length !== 0) {
			menu.empty();
		} else {
			menu = $(document.createElement('div'));
			menu.attr('id', 'mnc');
			menu.addClass('contentText');
			menuColumn().prepend(menu);
		}

		menu.append('<h1>myNoise Custom</h1>');

		drawMenu(genName, menu);
	}

	init();
})();
