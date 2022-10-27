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

  var searchTerm = getQueryVariable('query');
  var searchResults = document.getElementById('search-results');
  var sResults = '';
  if (searchTerm) {
    document.getElementById('search-box').setAttribute('value', searchTerm);
    
    var index = new FlexSearch.Document({
      id: "id",
      index: ["title", "content"],
      tokenize: "strict",
	    context: { 
	        resolution: 5,
	        depth: 3,
	        bidirectional: true
	    }
    });

    window.pages.forEach(page => {
      index.add(page);
    })

    var results = index.search(searchTerm);

    if (results.length) {
      sResults += '<section class="section section--top-s section--bottom-s">';
      sResults += '<div class="section__content">' + results[0].result.length + ' search results for <strong>' + searchTerm + '</strong></div>';
      sResults += '</section>';
      
      sResults += '<div class="page__middle page__middle--contained grid divider--top">';
      sResults += '<div class="page__sections grid__col grid--9-col">';
      sResults += '<div class="section section--bottom-m">';
      sResults += '<div class="section__content">';
      
      for (let i = 0; i < results[0].result.length; i++) {
        var item = window.pages[results[0].result[i]];
        sResults += '<div class="card card--result">';
        console.log(item.path);
        sResults += '<p class="text--l text--heading"><a href="' + item.path + '">' + item.heading + '</a></p>';
        sResults += '<p class="text--m">' + item.title + '</p>';
        sResults += '<p class="text--s">' + item.content.substring(0, 250) + '...</p>';
        sResults += '</div>';
      }
			sResults += '</div>';
			sResults += '</div>';
			sResults += '</div>';
			sResults += '<div class="page__sidebar page__sidebar--last grid__col grid--3-col spacing--top-m"><div class="tile tile--reverse"><p class="text--l text--heading">Are you trying to find datasets?</p><a class="button button--primary button--small" href="https://data.gov.au/search" target="_blank">Browse Dataset Catalogue</a></div></div>'
			sResults += '</div>';
      
    } else {
      sResults += '<section class="section section--top-s section--bottom-s"><div class="section__content">Sorry, there are no results for your search <i>' + searchTerm + '</i>. Try a different search term.</div></section><div class="page__middle page__middle--contained grid divider--top">';
    }

  } else {
  	sResults += '<section class="section section--top-s section--bottom-s"><div class="section__content">No terms searched. Try entering a term and clicking search.</div></section><div class="page__middle page__middle--contained grid divider--top">';
  }

	searchResults.innerHTML = sResults;
})();
