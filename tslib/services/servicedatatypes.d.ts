// Copyright (c) 2011-2013 Turbulenz Limited
// import {Window,TurbulenzBridgeConfig,TurbulenzBridgeServiceRequestData,TurbulenzBridgeServiceRequest,TurbulenzBridgeServiceResponseData,TurbulenzBridgeServiceResponse,GameSessionCreateRequest,GameSessionCreateResponseMappingTable,GameSessionCreateResponse,GameSessionDestroyRequest,UserDataRequestBase,UserDataGetKeysRequest,userDataExistsRequest,userDataGetRequest,userDataSetRequest,userDataRemoveRequest,userDataRemoveAllRequest,BadgeDescription,BadgeDescriptionList,BadgeMetaResponse,BadgeAddProgressRequest,BadgeProgress,BadgeAddResponse,BadgeProgressList,BadgeReadResponse,Currency,BasketItem,BasketItemList,Basket,CalculatedBasketItem,CalculatedBasketItemList,CalculatedBasket,StoreItem,StoreItemList,StoreOfferingOutput,StoreOffering,StoreOfferingList,StoreOfferingPriceAPI,StoreOfferingAPIResponse,StoreResource,StoreResourceList,StoreMetaData,TransactionRequest,Transaction,TransactionPaymentParameters,TransactionPayment} from './servicedatatypes.d.ts';

// Collection of type declarations used by both sides of the bridge,
// and by some services and managers that receive data across the
// bridge.  Some of these types correspond directly to JSON data
// passed back and forth between services.  This module can function
// as a canonical place to keep this type information.

//
// Elements on Windowt
//
export interface Window
{
    Turbulenz: any;
    gameSlug: string;
}

//
// TurbulenzBridgeConfig
//
// Structure sent to 'config.set' when 'config.request' is called.
export interface TurbulenzBridgeConfig
{
    mode                      : string;
    syncing?                  : boolean;
    offline?                  : boolean;
    servicesDomain?           : string;
    bridgeServices?           : boolean;
    joinMultiplayerSessionId? : string;
}

export interface TurbulenzBridgeServiceRequestData
{
    url: string;  // URL of the API this represents
    data: any;    // Data specific to the service request
}

//
// TurbulenzBridgeServiceRequest
//
// Structure sent to 'bridgeservices.*' requests
export interface TurbulenzBridgeServiceRequest
{
    key: number;
    data: TurbulenzBridgeServiceRequestData;
}

// The data part of a response to a bridge service.  This is extended
// by each of the provided services.
export interface TurbulenzBridgeServiceResponseData
{
    status: number;
}

//
// TurbulenzBridgeServiceResponse
//
// Structure sent from the bridge via 'bridgeservices.repsonse' in
// reply to 'bridgeservices.*' requests.  (Currently same as the
// request struct, but with a status value.
export interface TurbulenzBridgeServiceResponse
{
    key: number;
    data: TurbulenzBridgeServiceResponseData;
}

//
// GameSession API
//

export interface GameSessionCreateRequest
{
    closeExistingSessions?: number;  // 1 or unset
}

export interface GameSessionCreateResponseMappingTable
{
    assetPrefix: string;
    mappingTablePrefix: string;
    mappingTableURL: string;
}

export interface GameSessionCreateResponse extends TurbulenzBridgeServiceResponseData
{
    mappingTable: GameSessionCreateResponseMappingTable;
    gameSessionId: string;
}

export interface GameSessionDestroyRequest
{
    gameSessionId: string;
}

//
// UserData*Request structures
//

export interface UserDataRequestBase
{
    gameSessionId: string;
}
export interface UserDataGetKeysRequest extends UserDataRequestBase
{
}
export interface userDataExistsRequest extends UserDataRequestBase
{
}
export interface userDataGetRequest extends UserDataRequestBase
{
}
export interface userDataSetRequest extends UserDataRequestBase
{
    value: string;
}
export interface userDataRemoveRequest extends UserDataRequestBase
{
}
export interface userDataRemoveAllRequest extends UserDataRequestBase
{
}

//
// Badges
//

export interface BadgeDescription
{
    key             : string;
    title           : string; /// May be localized
    description     : string; /// May be localized
    visible         : boolean;
    shape           : string; /// "circle" or "diamond"
    total?          : number; /// May not be known, even for
                              /// progressive achievements

    points?         : number;
    predescription? : string;
    image?          : {
        'border-color'  : string;
        'icon'          : string;
    };
    imageresource?  : string;
}

export interface BadgeDescriptionList extends Array<BadgeDescription>
{
}

/// Returned by badge.meta (badges/read/<session>)
export interface BadgeMetaResponse extends TurbulenzBridgeServiceResponseData
{
    data: BadgeDescriptionList;
}

/// Data passed to badge.add (badge/progress/add/<session>)
export interface BadgeAddProgressRequest
{
    gameSessionId : string;
    badge_key     : string;
    current?      : number;  /// If omitted, the badge is awarded immediately
}

export interface BadgeProgress
{
    badge_key : string;
    achieved  : boolean;
    current?  : number;
    total?    : number;
}

/// Returned by badge.add call (badge/progress/add/<session>)
export interface BadgeAddResponse extends TurbulenzBridgeServiceResponseData
{
    data: BadgeProgress;
}

export interface BadgeProgressList extends Array<BadgeProgress>
{
}

/// Returned by badge.read call (badges/progress/read/<session>)
export interface BadgeReadResponse extends TurbulenzBridgeServiceResponseData
{
    data: BadgeProgressList;
}

//
// Currency
//
export interface Currency
{
    currencyName: string;
    alphabeticCode: string;
    numericCode: number;
    minorUnitPrecision: number;
}

//
export interface BasketItem
{
    amount: number;
}

export interface BasketItemList
{
    [key: string]: BasketItem;
}

//
// Basket - Simple list of items with no price or currency
// information, passed from StoreManager to the Bridge.
//
export interface Basket
{
    basketItems : BasketItemList;
    token       : string;
}

export interface CalculatedBasketItem
{
  amount: number;
  lineTotal: string;
  price: string;
}

//
// CalculatedBasket - The fully resolved basket returned from the
// TurbulenzBridge, with currency, price, lineprices, etc all
// calculated.
//
export interface CalculatedBasketItemList
{
    [key: string]: CalculatedBasketItem;
}

export interface CalculatedBasket
{
  currency : Currency;
  items    : CalculatedBasketItemList;
  total    : string;
  token?   : string;
}

//
// StoreItemList - item meta data with a key, title, description and index
//
export interface StoreItem
{
    key: string;
    title: string;
    description: string;
    index: number;
}

export interface StoreItemList
{
    [itemKey: string]: StoreItem;
}

//
// StoreOfferingOutput
//
export interface StoreOfferingOutput
{
    [outputKey: string]: { amount: number; };
}

//
// StoreOffering - meta data about a single offering in the store,
// passed from the bridge to StoreManager.
//
export interface StoreOffering extends StoreItem
{
    available : boolean;
    price     : string;
    output    : StoreOfferingOutput;
}

export interface StoreOfferingList
{
    [itemKey: string]: StoreOffering;
}

//
// StoreOfferingPriceAPI - the Price of an Offering, as used in
// StoreOfferingAPIResponse.  Each entry is the value in minor units
// for that currency.
//
export interface StoreOfferingPriceAPI
{
    [currencyCode: string]: number;
}

//
// StoreOfferingAPIResponse - the Offering information passed back from
// the http API.
//
export interface StoreOfferingAPIResponse extends StoreItem
{
    available : boolean;
    prices    : StoreOfferingPriceAPI;
    output    : StoreOfferingOutput;
}

export interface StoreOfferingAPIResponseList
{
    [offeringKey: string]: StoreOfferingAPIResponse;
}

//
// StoreResource - meta data about a single resource in the store
//
export interface StoreResource extends StoreItem
{
    type: string;
}

export interface StoreResourceList
{
    [itemKey: string]: StoreResource;
}

//
// StoreMetaData
//
// Passed from the Bridge to StoreManager
//
export interface StoreMetaData
{
    currency  : string;
    items     : StoreOfferingList;
    offerings : StoreOfferingList;
    resources : StoreResourceList;
}

//
// TransactionRequest - sent to 'api/v1/store/transactions/checkout'
//
export interface TransactionRequest
{
    gameSlug: string;
    basket?: any;              // TODO:
    paymentProvider?: string;  // 'googleplay', etc.  (default: 'amazon')
}

//
// Transaction - response from 'api/v1/store/transactions/checkout'
//
export interface Transaction
{
    transactionId   : string;
    paymentUrl?     : string;
    paymentProvider : string;
}

//
// TransactionPaymentParameters - parameters to
// 'api/v1/store/transactions/pay/<id>'
//
export interface TransactionPaymentParameters
{
    basket             : string;
    providerData       : string;
    providerSignature? : string;
}

//
// TransactionPayment - response from 'api/v1/store/transactions/pay/<id>'
//
export interface TransactionPayment
{
    status: string;    // "checkout", "processing", "completed"
}
