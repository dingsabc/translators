{
	"translatorID": "9f52911f-e1b5-41f8-be66-b16982269e6a",
	"label": "HLAS (historical)",
	"creator": "Sebastian Karcher",
	"target": "http://lcweb2.loc.gov/cgi-bin/query",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcs",
	"lastUpdated": "2013-02-26 13:17:57"
}

/*
	***** BEGIN LICENSE BLOCK *****
	
	Copyright © 2011 Sebastian Karcher and the Center for History and New Media
					 George Mason University, Fairfax, Virginia, USA
					 http://zotero.org
	
	This file is part of Zotero.
	
	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	
	You should have received a copy of the GNU Affero General Public License
	along with Zotero.  If not, see <http://www.gnu.org/licenses/>.
	
	***** END LICENSE BLOCK *****
*/

function detectWeb(doc, url) {
	//Z.debug(doc.title)
	if (doc.title.indexOf("Search Results")!=-1 && ZU.xpathText(doc, '//p/table/tbody/tr[td/a[contains(@href, "/cgi-bin/query/D?hlasbib")]]')) return "multiple";
	if (doc.title.indexOf("Bibliographic Display")!=-1) return "book";
}
	

function doWeb(doc, url){

	var articles = new Array();
	if(detectWeb(doc, url) == "multiple") { 
		var items = {};
		var titlerows = doc.evaluate('//p/table/tbody/tr[td/a[contains(@href, "/cgi-bin/query/D?hlasbib")]]', doc, null, XPathResult.ANY_TYPE, null);
		while (titlerow = titlerows.iterateNext()) {
			var url = ZU.xpathText(titlerow, './td/a[contains(@href, "/cgi-bin/query/D")]/@href');
			var title = ZU.xpathText(titlerow, './td[2]')
			items[url] = title;
		}
		Zotero.selectItems(items, function (items) {
			if (!items) {
				return true;
			}
			for (var i in items) {
				articles.push(i);
			}
			Zotero.Utilities.processDocuments(articles, scrape);	
		});
	} else {
		scrape(doc, url);
	}
}


function scrape(doc, url){
	//scrape the LC control number from the page and get LoC catalog data for it via SRU
	var idnumbers = ZU.xpathText(doc, '//body/p[b[contains(text(), "LC Control No")]]');
	if (idnumbers) var LCcontrol = idnumbers.match(/LC Control No\:\s*(\d+)/)[1]
	ZU.doGet("http://z3950.loc.gov:7090/voyager?version=1.1&operation=searchRetrieve&query=dc.resourceIdentifier=" + LCcontrol + "&maximumRecords=1", function (text) {
		//Z.debug(text);
		var translator = Zotero.loadTranslator("import");
		translator.setTranslator("edd87d07-9194-42f8-b2ad-997c4c7deefd");
		translator.setString(text);
		translator.translate();
	});
}/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "http://lcweb2.loc.gov/cgi-bin/query/r?hlas/hlasbib,hlasretro,:@FIELD(FLD001+@od1(bi%2090010102))",
		"items": [
			{
				"itemType": "book",
				"creators": [
					{
						"firstName": "Laszlo",
						"lastName": "Horvath",
						"creatorType": "author"
					},
					{
						"lastName": "Hoover Institution on War, Revolution, and Peace",
						"fieldMode": true
					},
					{
						"lastName": "Stanford University",
						"fieldMode": true
					}
				],
				"notes": [],
				"tags": [
					"Perón, Juan Domingo",
					"Bibliography Catalogs",
					"Perón, Eva",
					"Bibliography Catalogs",
					"Perón, Isabel",
					"Bibliography Catalogs",
					"Peronism",
					"Bibliography Catalogs",
					"Peronism",
					"Manuscripts Catalogs",
					"Peronism",
					"Sources Bibliography Catalogs",
					"Argentina",
					"History Bibliography Catalogs",
					"1943-"
				],
				"seeAlso": [],
				"attachments": [],
				"ISBN": "0817927123",
				"title": "Peronism and the three Perons: a checklist of material on peronism and on Juan Domingo, Eva, and Isabel Peron, and their writings, in the Hoover Institution library and archives and in the Stanford University Libraries",
				"place": "Stanford, CA",
				"publisher": "Hoover Institution, Stanford University",
				"date": "1988",
				"numPages": "170",
				"series": "Hoover Press bibliography",
				"seriesNumber": "71",
				"callNumber": "Z1630.3 F2849 .H67 1988",
				"libraryCatalog": "HLAS (historical)",
				"shortTitle": "Peronism and the three Perons"
			}
		]
	}
]
/** END TEST CASES **/