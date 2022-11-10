(function() {
	function getQueryVariable(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (pair[0] === variable) {
				return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
			}
		}
	}
	const previewChars = 200;
	const sSidebar = '<div class="page__sidebar page__sidebar--last grid__col grid--3-col spacing--top-m"><div class="tile tile--reverse"><p class="text--l text--heading">Are you trying to find datasets?</p><a class="button button--primary button--small" href="https://data.gov.au/search" target="_blank">Browse Dataset Catalogue</a></div></div>';
	var searchTerm = getQueryVariable('query');
	var searchResults = document.getElementById('search-results');
	var sResults = '';
	var sResultsDiv = '';
	if (searchTerm) {
		document.getElementById('search-box')
			.setAttribute('value', searchTerm);
		var index = new FlexSearch.Document({
			id: 'id',
			index: ['title', 'heading', 'content'],
			charset: "latin:advanced",
      tokenize: "full",
    	matcher: "default",
      //resolution : 40,
      //threshold : 22,
      cache: true
		});
		window.pages.forEach(page => {
			index.add(page);
		})
		var results = index.search({
			enrich: true,
			bool: 'or',
			index: [{
				field: 'title',
				query: searchTerm,
				limit: 100,
				suggest: false
			}, {
				field: 'heading',
				query: searchTerm,
				limit: 100,
				suggest: false
			}, {
				field: 'content',
				query: searchTerm,
				limit: 100,
				suggest: false
			}]
		});
		console.log(results);
		//if (results.length > 0) {
			let resultCount = 0;
			for (let i = 0; i < results.length; i++) {
				for (let j = 0; j < results[i].result.length; j++) {
					resultCount++;
					var item = window.pages[results[i].result[j]];
					sResults += '<div class="card card--result">';
					//console.log(item.path);
					sResults += '<p class="text--l text--heading"><a href="' + item.path + '">' + item.heading + '</a></p>';
					sResults += '<p class="text--m">' + item.title + '</p>';
					sResults += '<p class="text--s">' + item.content.substring(0, previewChars) + '...</p>';
					sResults += '</div>';
				}
			}
			sResultsDiv += '<div id="block-content">';
			sResultsDiv += '<section class="section section--top-s section--bottom-s">';
			sResultsDiv += '<div class="section__content">' + resultCount + ' results found for <strong>' + searchTerm + '</strong></div>';
			sResultsDiv += '</section>';
			sResultsDiv += '<div class="page__middle page__middle--contained grid divider--top">';
			sResultsDiv += '<div class="page__sections grid__col grid--9-col">';
			sResultsDiv += '<div class="section section--bottom-m">';
			sResultsDiv += '<div class="section__content">';
			if (resultCount == 0) {
				sResultsDiv += '<h2 class="text--primary">Sorry, we couldn\'t find anything for <strong>' + searchTerm + '.</strong></h2>';
				sResultsDiv += '<p class="text--xl">Please try searching for something else.</p>';
			} else {
				sResultsDiv += sResults
			}
			sResultsDiv += '</div>';
			sResultsDiv += '</div>';
			sResultsDiv += '</div>';
			sResultsDiv += sSidebar;
			sResultsDiv += '</div>';
			sResultsDiv += '</div>';
		//} else {
		//	sResultsDiv += '<section class="section section--top-s section--bottom-s"><div class="section__content">Sorry, there are no results for your search <i>' + searchTerm + '</i>. Try a different search term.</div></section><div class="page__middle page__middle--contained grid divider--top">';
		//}
	} else {
		sResultsDiv += '<div id="block-content"><div class="views-element-container"><section class="section section--top-s section--bottom-s"><div class="section__content"> 0 results</div></section><div class="page__middle page__middle--contained grid divider--top"><div class="page__sections grid__col grid--9-col"><div class="section section--bottom-m"><div class="section__content"><h2 class="text--primary">No terms searched.</h2><p class="text--xl">Try entering a term and clicking search.</p></div></div></div>' + sSidebar + '</div></div></div>';
	}
	searchResults.innerHTML = sResultsDiv;
})();


