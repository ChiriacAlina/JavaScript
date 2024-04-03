"use strict";

debugger;

const formatData = value => value.toFixed(2);

class View {
    constructor(viewId) {
        this.viewContent = document.querySelector(viewId);
    }

    connectEvent(event, callback) {
        this.viewContent.addEventListener(event, callback);
    }
}

class TemplatedView extends View {
    constructor(viewId, templateId) {
        super(viewId);
        this.template = new Template(templateId, this.fillItemCb);
    }

    update(data) {
        this.viewContent.textContent = "";
        const content = this.template.fillCollection(data);
        this.viewContent.appendChild(content);
    }
}

class ProduseView extends TemplatedView {
    constructor(viewId, templateId) {
        super(viewId, templateId);
    }

    fillItemCb({ nume, img, pret }, target, index) {
        target.querySelector(".produs").dataset.index = index;
        target.querySelector(".nume").textContent = nume;

        let image = target.querySelector(".img");
        image.setAttribute("src", img);
        image.setAttribute("alt", nume);

        target.querySelector(".pret").textContent = formatData(pret);
    }

}

class BasketView extends TemplatedView {
    constructor(viewId, templateId, totalId) {
        super(viewId, templateId);
        this.total = document.querySelector(totalId);
    }

    fillItemCb({ nume, cantitate, pret }, target, index) {
        target.querySelector(".change").dataset.index = index;
        target.querySelector(".nume").textContent = nume;
        target.querySelector(".cantitate").value = cantitate;
        target.querySelector(".pret").textContent = formatData(pret);
        target.querySelector(".total").textContent = formatData(pret * cantitate);
    }


    update(data) {
        super.update(data);
        const total = data.reduce((sum, { pret, cantitate }) => sum += pret * cantitate, 0);
        this.total.textContent = formatData(total);
    }
}


class Controller {

    constructor(model, produse, basket, sortare) {
        this.model = [...model];
        this.produse = produse;
        produse.update(this.model);

        produse.connectEvent("click", this.addBasketItem.bind(this));

        this.basket = basket;
        this.readBasket();

        basket.connectEvent("click", this.removeBasketItem.bind(this));
        basket.connectEvent("change", this.updateCantitate.bind(this));
        basket.connectEvent("click", this.plusBasketItem.bind(this));
        basket.connectEvent("click", this.minusBasketItem.bind(this));

        this.sortare = sortare;

        sortare.connectEvent("change", this.onChangeOrder.bind(this));

        this.orderBy(sortare.viewContent.value);
    }

    readBasket() {
        this.basketItems = JSON.parse(sessionStorage.getItem("basket")) || [];
        this.basket.update(this.basketItems);
    }


    getEventIndex(event) {
        return event.target.parentElement.dataset?.index;
    }

    getItem(produs) {
        return { ...produs, cantitate: 1 };
    }

    updateBasket() {
        this.basket.update(this.basketItems);
        sessionStorage.setItem("basket", JSON.stringify(this.basketItems));
    }

    addBasketItem(event) {
        const index = this.getEventIndex(event);

        if (!index) {
            return;
        }

        const produs = this.model[index];

        const existing = this.basketItems.find(item => item.nume == produs.nume);

        if (existing) {
            existing.cantitate++;
        } else {
            this.basketItems.push(this.getItem(produs));
        }

        this.updateBasket();
    }

    removeBasketItem(event) {
        if (!event.target.classList.contains("delete")) {
            return;
        }

        const index = this.getEventIndex(event);
        if (!index) {
            return;
        }

        this.basketItems.splice(index, 1);

        this.updateBasket();
    }

    plusBasketItem(event) {
        if (!event.target.classList.contains("plus")) {
            return;
        }

        const index = this.getEventIndex(event);
        if (!index) {
            return;
        }

        this.basketItems[index].cantitate += 1;
        this.updateBasket();
    }

    minusBasketItem(event) {

        if (!event.target.classList.contains("minus")) {
            return;
        }

        const index = this.getEventIndex(event);
        if (!index) {
            return;
        }
        if (this.basketItems[index].cantitate > 0) {
            this.basketItems[index].cantitate -= 1;
            this.updateBasket();
        }

    }

    updateCantitate(event) {
        let index = this.getEventIndex(event);
        this.basketItems[index].cantitate = event.target.value;
        this.updateBasket();
    }

    nume(p1, p2) {
        if (p1.nume < p2.nume) {
            return -1;
        } else if (p2.nume < p1.nume) {
            return 1;
        }

        return 0;
    }

    pretAsc(p1, p2) {
        return p1.pret - p2.pret;
    }

    pretDesc(p1, p2) {
        return p2.pret - p1.pret;
    }


    orderBy(criteria) {
        const order = this[criteria];

        if (order) {
            this.model.sort(order);
            this.produse.update(this.model);
        }
    }

    onChangeOrder(event) {
        this.orderBy(event.target.value);
    }
}


const produse = new ProduseView("#produse-container", "#produs-template");
const basket = new BasketView("#basket-container", "#basket-template", "#total-cos");
const sortare = new View("#sortare");

const controller = new Controller(model, produse, basket, sortare);

