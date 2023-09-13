import { requestsService } from "./requestsService.js";

const params = [
    'type=teaser',
    'issuedAfter=2023-03-01T00:00:00.000Z',
    'issuedBefore=2023-09-01T00:00:00.000Z'
];

const teasersDiv = document.querySelector('.teasers');
const teasersNoSchoolDiv = document.querySelector('.teasers-noschool');

const createHtmlElement = (elemTag, text = '') => {
    const elem = document.createElement(elemTag);
    const textNode = document.createTextNode(text);
    elem.appendChild(textNode);

    return elem;

}

const getTeasers = async (params) => {
    const teasers = await requestsService.get(...params);
    teasersDiv.innerHTML = ' ';
    if(teasers.results.length === 0) {
        const title = createHtmlElement('h5', 'Ops!, something goes wrong.');
        teasersDiv.appendChild(title);
        return
    }

    const teasersWithRelations = teasers.results.filter(teaser => teaser.$$expanded.$$relationsTo[0] !== undefined);
    const teasersWithOutRelations = teasers.results.filter(teaser => teaser.$$expanded.$$relationsTo[0] === undefined);
    const teasersNotIncludedInNewsletters = teasersWithRelations.filter( teaser => teaser.$$expanded.$$relationsTo[0].$$expanded.$$relationsTo !== 'IS_INCLUDED_IN')
    const filteredTeasers = [...teasersWithOutRelations, ...teasersNotIncludedInNewsletters]
    .sort(function(a, b) {
        var c = new Date(a.$$expanded.issued);
        var d = new Date(b.$$expanded.issued);
        return d-c;
    });;
    const teasersNotMeantForSchools = filteredTeasers.filter( teaser => !teaser.$$expanded?.outypes?.includes('SCHOOL'));
    
    const teasersCount = createHtmlElement('span', teasersNotMeantForSchools.length);
    teasersNoSchoolDiv.appendChild(teasersCount);

    filteredTeasers.forEach( teaser => {
       const title = createHtmlElement('h5', teaser.$$expanded.title);
       const parsedData = new Date(teaser.$$expanded.issued);
       const date = createHtmlElement('h6', 'Date of publication: ');
       const dateSpan = createHtmlElement('span', parsedData.toDateString());
       date.appendChild(dateSpan);
       date.classList.add('date');

       const teaserDiv = createHtmlElement('div');
       teaserDiv.appendChild(title);
       teaserDiv.appendChild(date);
       teasersDiv.appendChild(teaserDiv);       
    });
}
getTeasers(params);