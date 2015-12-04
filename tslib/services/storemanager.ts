// Copyright (c) 2011-2013 Turbulenz Limited
import gamesession = require('./gamesession.ts');
import turbulenzservices = require('./turbulenzservices.ts');
import turbulenzbridge = require('./turbulenzbridge.ts');
import sessiontoken = require('./sessiontoken.ts');
import debug = require('../debug.ts');
import requesthandleri = require('../requesthandler.ts');
import {Shader,Semantics,Technique,DrawParameters,PhysicsDevice,PhysicsPoint2PointConstraint,PhysicsRigidBody,PhysicsWorld,PhysicsCollisionObject,Texture,RenderTarget,RenderBuffer,InputDevice,TechniqueParameters,IndexBuffer,VertexBuffer,MathDevice,TechniqueParameterBuffer,GraphicsDevice,InputDeviceEventListener,PhysicsCharacter,Sound,SoundDevice,TurbulenzEngine} from '../../tslib/turbulenz.d.ts';
import {Window,TurbulenzBridgeConfig,TurbulenzBridgeServiceRequestData,TurbulenzBridgeServiceRequest,TurbulenzBridgeServiceResponseData,TurbulenzBridgeServiceResponse,GameSessionCreateRequest,GameSessionCreateResponseMappingTable,GameSessionCreateResponse,GameSessionDestroyRequest,UserDataRequestBase,UserDataGetKeysRequest,userDataExistsRequest,userDataGetRequest,userDataSetRequest,userDataRemoveRequest,userDataRemoveAllRequest,BadgeDescription,BadgeDescriptionList,BadgeMetaResponse,BadgeAddProgressRequest,BadgeProgress,BadgeAddResponse,BadgeProgressList,BadgeReadResponse,Currency,BasketItem,BasketItemList,Basket,CalculatedBasketItem,CalculatedBasketItemList,CalculatedBasket,StoreItem,StoreItemList,StoreOfferingOutput,StoreOffering,StoreOfferingList,StoreOfferingPriceAPI,StoreOfferingAPIResponse,StoreResource,StoreResourceList,StoreMetaData,TransactionRequest,Transaction,TransactionPaymentParameters,TransactionPayment} from './servicedatatypes.d.ts';
import {turbulenzEngine} from '../turbulenz.d.ts';

/*global TurbulenzServices: false*/
/*global turbulenzEngine: false*/
/*global TurbulenzBridge: false*/
/*global SessionToken: false*/
/*global debug: false*/

//
// UserItem - A record of an Item owned by the user
//
export interface UserItem
{
    amount: number;
};

export interface UserItemList
{
    [itemKey: string]: UserItem;
};

//
export interface StoreManagerErrorCB
{
    (msg: string, status?: number, fn_called?: any, parameters_given?: any[]): void;
};

//
export interface StoreManagerMetaReceivedCB
{
    (storeManager: StoreManager): void;
};

//
export interface StoreManagerUserItemsCB
{
    (userItems: UserItemList): void;
};

//
export interface StoreManagerBasketUpdatedCB
{
    (): void;
};

//
export interface UpdateBasketCallbackList
{
    [token: string] : StoreManagerBasketUpdatedCB;
};

//
// StoreManager
//
export class StoreManager
{
    static version = 1;

    gameSession             : gamesession.GameSession;
    gameSessionId           : string;
    errorCallbackFn         : StoreManagerErrorCB;
    service                 : turbulenzservices.ServiceRequester;
    requestHandler          : requesthandleri.RequestHandler;
    basketUpdateRequestToken: sessiontoken.SessionToken;
    userItemsRequestToken   : sessiontoken.SessionToken;
    consumeRequestToken     : sessiontoken.SessionToken;
    ready                   : boolean;
    currency                : string;
    offerings               : StoreOfferingList;
    resources               : StoreResourceList;
    basket                  : { items: BasketItemList; };
    userItems               : UserItemList;
    updateBasketCallbacks   : UpdateBasketCallbackList;

    onBasketUpdate          : { (basket: CalculatedBasket): void; };
    onSitePurchaseConfirmed : { (): void; };
    onSitePurchaseRejected  : { (): void; };

    requestUserItems(callbackFn: StoreManagerUserItemsCB,
                     errorCallbackFn?: StoreManagerErrorCB)
    {
        var that = this;

        var requestUserItemsCallback =
            function requestUserItemsCallbackFn(jsonResponse, status)
        {
            if (status === 200)
            {
                that.userItems = jsonResponse.data.userItems;
                if (callbackFn)
                {
                    callbackFn(jsonResponse.userItems);
                }
            }
            else
            {
                var errorCallback = errorCallbackFn || that.errorCallbackFn;
                if (errorCallback)
                {
                    errorCallback("StoreManager.requestUserItems failed with " +
                                  "status " + status + ": " + jsonResponse.msg,
                                  status,
                                  that.requestUserItems,
                                  [callbackFn, errorCallbackFn]);
                }
            }
        };

        var dataSpec = {
            // replay attack token
            token: this.userItemsRequestToken.next(),
            gameSessionId: this.gameSessionId
        };

        this.service.request({
                url: '/api/v1/store/user/items/read/' + this.gameSession.gameSlug,
                method: 'GET',
                data: dataSpec,
                callback: requestUserItemsCallback,
                requestHandler: this.requestHandler,
                encrypt: true
            }, 'store.useritems');
    }

    getUserItems(): UserItemList
    {
        return this.userItems;
    }

    getItemsSortedDict(items: StoreItemList): StoreItemList
    {
        // sort items by index and add keys to item objects
        var itemsArray : StoreItem[] = [];
        var sortedItemsDict : StoreItemList = {};

        var itemKey : string;
        var item : StoreItem;
        for (itemKey in items)
        {
            if (items.hasOwnProperty(itemKey))
            {
                item = items[itemKey];
                item.key = itemKey;
                itemsArray[item.index] = item;
            }
        }

        var i;
        var itemsLength = itemsArray.length;
        for (i = 0; i < itemsLength; i += 1)
        {
            item = itemsArray[i];
            sortedItemsDict[item.key] = item;
        }

        return sortedItemsDict;
    }

    getOfferings(): StoreOfferingList
    {
        return <StoreOfferingList> this.getItemsSortedDict(this.offerings);
    }

    getResources(): StoreResourceList
    {
        return <StoreResourceList> this.getItemsSortedDict(this.resources);
    }

    // backwards compatibility
    getItems(): any
    {
        return this.getOfferings();
    }

    updateBasket(callback: StoreManagerBasketUpdatedCB): void
    {
        var token = null;
        if (callback)
        {
            token = this.basketUpdateRequestToken.next();
            this.updateBasketCallbacks[token] = callback;
        }
        var that = this;
        turbulenzEngine.setTimeout(function yieldOnUpdate()
            {
                turbulenzbridge.TurbulenzBridge.triggerBasketUpdate(JSON.stringify(<Basket>{
                    basketItems: that.basket.items,
                    token: token
                }));
            }, 0);
    }

    addToBasket(key: string, amount: number): boolean
    {
        var offering = this.offerings[key];
        if (!offering ||
            !offering.available ||
            Math.floor(amount) !== amount ||
            amount <= 0)
        {
            return false;
        }

        var resources = this.resources;
        function isOwnOffering(offering: StoreOffering) : boolean
        {
            var outputKey;
            var output = offering.output;
            for (outputKey in output)
            {
                if (output.hasOwnProperty(outputKey))
                {
                    if (resources[outputKey].type !== 'own')
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        var userItems = this.userItems;
        function allOutputOwned(offering: StoreOffering) : boolean
        {
            var outputKey;
            var output = offering.output;
            for (outputKey in output)
            {
                if (output.hasOwnProperty(outputKey))
                {
                    if (!userItems.hasOwnProperty(outputKey) ||
                        userItems[outputKey].amount === 0)
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        var basketItems = this.basket.items;
        var oldBasketAmount = 0;
        if (basketItems[key])
        {
            oldBasketAmount = basketItems[key].amount;
        }
        else
        {
            oldBasketAmount = 0;
        }
        var newBasketAmount = oldBasketAmount + amount;
        var ownOffering = isOwnOffering(offering);
        if (ownOffering && newBasketAmount > 1)
        {
            newBasketAmount = 1;
            if (oldBasketAmount === 1)
            {
                // no change made so return false
                return false;
            }
        }
        if (newBasketAmount <= 0 || (ownOffering && allOutputOwned(offering)))
        {
            return false;
        }

        basketItems[key] = {amount: newBasketAmount};
        return true;
    }

    removeFromBasket(key: string, amount: number): boolean
    {
        if (!this.offerings[key] ||
            Math.floor(amount) !== amount ||
            amount <= 0)
        {
            return false;
        }
        var basketItem = this.basket.items[key];
        if (!basketItem || basketItem.amount <= 0)
        {
            return false;
        }

        var newAmount = basketItem.amount - amount;
        if (newAmount <= 0)
        {
            delete this.basket.items[key];
        }
        else
        {
            this.basket.items[key] = {amount: newAmount};
        }
        return true;
    }

    emptyBasket()
    {
        this.basket.items = {};
    }

    isBasketEmpty(): boolean
    {
        var key;
        var basketItems = this.basket.items;
        for (key in basketItems)
        {
            if (basketItems.hasOwnProperty(key) && basketItems[key].amount > 0)
            {
                return false;
            }
        }
        return true;
    }

    showConfirmPurchase(): boolean
    {
        if (this.isBasketEmpty())
        {
            return false;
        }
        this.updateBasket(function showConfirmPurchaseBasketUpdate()
            {
                turbulenzbridge.TurbulenzBridge.triggerShowConfirmPurchase();
            });
        return true;
    }

    consume(key, consumeAmount, callbackFn, errorCallbackFn)
    {
        var that = this;
        var consumeItemsCallback =
            function consumeItemsCallbackFn(jsonResponse, status)
        {
            if (status === 200)
            {
                that.userItems = jsonResponse.data.userItems;
                if (callbackFn)
                {
                    callbackFn(jsonResponse.data.consumed);
                }

                turbulenzbridge.TurbulenzBridge.triggerUserStoreUpdate(JSON.stringify(that.userItems));
            }
            else
            {
                var errorCallback = errorCallbackFn || that.errorCallbackFn;
                if (errorCallback)
                {
                    errorCallback("StoreManager.consume failed with status " + status + ": " + jsonResponse.msg,
                                  status,
                                  that.consume,
                                  [callbackFn, errorCallbackFn]);
                }
            }
        };

        var dataSpec = {
            // replay attack token
            token: this.consumeRequestToken.next(),
            gameSessionId: this.gameSessionId,
            key: key,
            consume: consumeAmount
        };

        this.service.request({
                url: '/api/v1/store/user/items/consume',
                method: 'POST',
                data: dataSpec,
                callback: consumeItemsCallback,
                requestHandler: this.requestHandler,
                encrypt: true
            }, 'store.useritems-consume');
    }

    static create(requestHandler: requesthandleri.RequestHandler,
                  gameSession: gamesession.GameSession,
                  storeMetaReceived?: StoreManagerMetaReceivedCB,
                  errorCallbackFn?: StoreManagerErrorCB): StoreManager
    {
        if (!turbulenzservices.TurbulenzServices.available())
        {
            debug.debug.log("storeManagerCreateFn: !! turbulenzservices.TurbulenzServices not available");

            // Call error callback on a timeout to get the same behaviour as the ajax call
            turbulenzEngine.setTimeout(function () {
                if (errorCallbackFn)
                {
                    errorCallbackFn('TurbulenzServices.createStoreManager ' +
                                    'requires Turbulenz services');
                }
            }, 0);
            return null;
        }

        var storeManager = new StoreManager();

        storeManager.gameSession = gameSession;
        storeManager.gameSessionId = gameSession.gameSessionId;
        storeManager.errorCallbackFn = errorCallbackFn || turbulenzservices.TurbulenzServices.defaultErrorCallback;
        storeManager.service = turbulenzservices.TurbulenzServices.getService('store');
        storeManager.requestHandler = requestHandler;

        storeManager.userItemsRequestToken = sessiontoken.SessionToken.create();
        storeManager.basketUpdateRequestToken = sessiontoken.SessionToken.create();
        storeManager.consumeRequestToken = sessiontoken.SessionToken.create();

        storeManager.ready = false;

        storeManager.offerings = null;
        storeManager.resources = null;
        storeManager.basket = null;
        storeManager.userItems = null;

        var calledMetaReceived = false;
        function checkMetaReceived() : void
        {
            if (!calledMetaReceived &&
                storeManager.offerings !== null &&
                storeManager.resources !== null &&
                storeManager.basket !== null &&
                storeManager.userItems !== null)
            {
                if (storeMetaReceived)
                {
                    storeMetaReceived(storeManager);
                }
                storeManager.ready = true;
                calledMetaReceived = true;
            }
        }

        storeManager.requestUserItems(checkMetaReceived);

        storeManager.onBasketUpdate = null;
        storeManager.updateBasketCallbacks = {};
        var onBasketUpdate = function onBasketUpdateFn(jsonParams) : void
        {
            var basket = <CalculatedBasket>(JSON.parse(jsonParams));
            var token;
            if (basket.token)
            {
                token = basket.token;
                delete basket.token;
            }

            storeManager.basket = basket;
            if (token && storeManager.updateBasketCallbacks.hasOwnProperty(token))
            {
                storeManager.updateBasketCallbacks[token]();
                delete storeManager.updateBasketCallbacks[token];
            }
            if (storeManager.onBasketUpdate)
            {
                storeManager.onBasketUpdate(basket);
            }

            checkMetaReceived();
        };
        turbulenzbridge.TurbulenzBridge.setOnBasketUpdate(onBasketUpdate);
        turbulenzbridge.TurbulenzBridge.triggerBasketUpdate();

        var onStoreMeta = function onStoreMetaFn(jsonMeta: string) : void
        {
            var meta = <StoreMetaData>(JSON.parse(jsonMeta));
            storeManager.currency = meta.currency;
            storeManager.offerings = meta.items || meta.offerings;
            storeManager.resources = meta.resources;
            checkMetaReceived();
        };
        turbulenzbridge.TurbulenzBridge.setOnStoreMeta(onStoreMeta);
        turbulenzbridge.TurbulenzBridge.triggerFetchStoreMeta();

        storeManager.onSitePurchaseConfirmed = null;
        function onSitePurchaseConfirmed() : void
        {
            function gotNewItems() : void
            {
                if (storeManager.onSitePurchaseConfirmed)
                {
                    storeManager.onSitePurchaseConfirmed();
                }
            }
            storeManager.requestUserItems(gotNewItems);
        };
        turbulenzbridge.TurbulenzBridge.setOnPurchaseConfirmed(onSitePurchaseConfirmed);

        storeManager.onSitePurchaseRejected = null;
        var onSitePurchaseRejected = function onSitePurchaseRejectedFn() : void
        {
            if (storeManager.onSitePurchaseRejected)
            {
                storeManager.onSitePurchaseRejected();
            }
        };
        turbulenzbridge.TurbulenzBridge.setOnPurchaseRejected(onSitePurchaseRejected);

        return storeManager;
    }
}
