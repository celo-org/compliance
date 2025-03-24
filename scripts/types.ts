export interface ID {
  uid: number;
  idType: string;
  idNumber: string;
}

export interface SDNList {
  // I know there's a type, there's a typo in the XML as well...
  publshInformation: {
    Publish_Date: string;
    Record_Count: number;
  };
  sdnEntry: {
    uid: number;
    lastName: string;
    sdnType: "Entity";
    programList: unknown;
    akaList: unknown;
    addressList: unknown;
    idList: {
      id: ID | ID[];
    };
  }[];
}

export interface Publication {
  publishInformation: SDNList["publshInformation"];
  sanctionnedAddresses: string[];
}
