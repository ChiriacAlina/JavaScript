"use strict";

/**
 * Template -   clasa care selecteaza elementul template din pagina si genereaza
 *              elemente pentru popularea paginii folosind o functie de callback
 */
class Template {

    /**
     * metoda constructor
     * @param {string}   templateId - id-ul pentru elementul template din pagina
     * @param {function} itemCb     - functia de callback folosita pentru
     *                                popularea elementelor generate
     */
    constructor(templateId, itemCb) {
        this.templateContent = document.querySelector(templateId).content;
        this.itemCb = itemCb;
    }

    /**
     * fillItem()  -    populeaza un element cu datele din parametru cu ajutorul
     *                  functiei de callback
     *
     * @param {object} itemData - obiectul ale carui date se completeaza in pagina
     * @returns elementul completat
     */
    fillItem(itemData, index) {
        let result = this.templateContent.cloneNode(true);
        this.itemCb(itemData, result, index);
        return result;
    }

    /**
     * fillCollection() -   populeaza o colectie de elemente cu datele din
     *                      parametru cu ajutorul functiei de callback
     *
     * @param {collection} data - o colectie de date ce trebuie adaugate in pagina
     * @returns un DocumentFragment completat cu datele din colectie
     */
    fillCollection(data) {
        let result = document.createDocumentFragment();

        let index = 0;
        for (let item of data) {
            result.appendChild(this.fillItem(item, index++));
        }

        return result;
    }
}
