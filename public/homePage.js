'use strict'

//Выход из личного кабинета
const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        }
    });
};

//Получение информации о пользователе
ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

//Получение текущих курсов валюты
const ratesBoard = new RatesBoard();
function getCurrRates() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
};

setInterval(getCurrRates, 60000);

//Операции с деньгами
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            return moneyManager.setMessage(response.success, 'баланс успешно пополнен на ' + data.amount + data.currency);
        }
        return moneyManager.setMessage(response.success, 'Ошибка: ' + response.error);
    });
};

moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            return moneyManager.setMessage(response.success, 'Конвертация успешно произведена на сумму: ' + data.fromAmount + data.fromCurrency);
        }
        return moneyManager.setMessage(response.success, 'Ошибка: ' + response.error);
    });
};

moneyManager.sendMoneyCallback  = data => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            //moneyManager.sendMoneyCallback();
            ProfileWidget.showProfile(response.data);
            return moneyManager.setMessage(response.success, 'Перевод успешно произведен на сумму: ' + data.amount  + data.currency + ' получателю: ID' + data.to);
        }
        return moneyManager.setMessage(response.success, 'Ошибка: ' + response.error);
    });
};

//Работа с избранным
const favoritesWidget = new FavoritesWidget;
ApiConnector.getFavorites(response => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        return;
    }
});

favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            return moneyManager.setMessage(response.success, 'Новый пользователь: ' + data.id + data.name + ' -успешно добавлен!');
        }
        return moneyManager.setMessage(response.success, 'Ошибка: ' + response.error);
    });
};

favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            return moneyManager.setMessage(response.success, 'Пользователь: ' + data.id + data.name + ' -успешно удален!');
        }
        return moneyManager.setMessage(response.success, 'Ошибка: ' + response.error);
    });
};