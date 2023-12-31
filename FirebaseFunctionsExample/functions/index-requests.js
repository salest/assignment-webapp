const axios = require('axios');

const getStoreDataURL = 'http://127.0.0.1:5001/assignmenttestproject-8d3dd/us-central1/getSpecificStoreData';
const getDataRangeTestURL = 'http://127.0.0.1:5001/assignmenttestproject-8d3dd/us-central1/getDataByDateRange';
const patchTestURL = 'http://127.0.0.1:5001/assignmenttestproject-8d3dd/us-central1/updateDataByField';
const clearCollectionURL = 'http://127.0.0.1:5001/assignmenttestproject-8d3dd/us-central1/clearCollection';
//Initial Data to load
const data = [
    {
        "StoreName": "コンビニマート 東京国際フォーラム店",
        "StaffName": "田中",
        "ErrorCase": {
            "ReportOther": {
                "Arm": true
            }
        },
        "TicketLink": "https://telexistence.slack.com/archives/C02G5QTSP5H/p1664239630955079",
        "StoreId": "familymart-9710347e-a261-4165-8404-29877287878a",
        "WorkTime": {
            "Other": 8,
            "Maintenance": 50,
            "ToBack": 12,
            "ToStore": 30
        },
        "WorkLog": "アーム内のケーブルの接触不良を交換",
        "WorkDate": "2023-01-22T22:00:12.086"
    },
    {
        "StoreName": "コンビニマート 経済産業省店",
        "StaffName": "佐藤",
        "ErrorCase": {
            "ReportOther": {
                "Arm": true
            }
        },
        "TicketLink": "https://telexistence.slack.com/archives/C02G5QTSP5H/p1664239630955079",
        "Id": "dbabc206-5a98-4435-877c-1e1e10740d8d",
        "WorkTime": {
            "Other": 20,
            "Maintenance": 55,
            "ToBack": 35,
            "ToStore": 45
        },
        "WorkLog": "アーム内アクチュエータの点検を実施",
        "WorkDate": "2023-01-23T06:45:22.022",
        "StoreId": "familymart-819d4094-32ef-41f1-a3c3-e6e88d30cebc"
    },
    {
        "StoreName": "コンビニマート 豊洲ベイサイドクロス店",
        "StaffName": "鈴木",
        "ErrorCase": {
            "ReportOther": {
                "Others": true
            }
        },
        "TicketLink": "https://telexistence.slack.com/archives/C02G5QTSP5H/p1664239630955079",
        "Id": "00fcb160-fda3-4ed8-8fc0-c5f620cbf8df",
        "WorkTime": {
            "Other": 16,
            "Maintenance": 78,
            "ToBack": 15,
            "ToStore": 30
        },
        "WorkLog": "カーテン不良のため、交換を実施。",
        "WorkDate": "2023-01-24T11:40:30.001",
        "StoreId": "familymart-819d4094-32ef-41f1-a3c3-e6e88d30cebc"
    },
    {
        "StoreName": "コンビニマート 豊洲ベイサイドクロス店",
        "StaffName": "大森、岩瀬",
        "ErrorCase": {
            "ReportOther": {
                "Others": true
            }
        },
        "TicketLink": "https://telexistence.slack.com/archives/C02G5QTSP5H/p1664239630955079",
        "Id": "00fcb160-fda3-4ed8-8fc0-c5f620cbf8df",
        "WorkTime": {
            "Other": 6,
            "Maintenance": 11,
            "ToBack": 10,
            "Total": 53,
            "ToStore": 26
        },
        "WorkLog": "カーテンがOPENしない。\n番重がカーテンにあたり開閉出来なくなり、エンドキャップを壊したので、交換を実施。",
        "WorkDate": "2023-01-27T21:54:34.086",
        "StoreId": "familymart-819d4094-32ef-41f1-a3c3-e6e88d30cebc"
    },
    {
        "WorkLog": "左のRSカメラが映らなくなった。\nL型USBの抜き差しを行い、カメラ映像が映るのを確認しました。",
        "WorkDate": "2023-01-27T22:12:36.829",
        "WorkTime": {
            "Other": 12,
            "ToStore": 28,
            "ToBack": 25,
            "Maintenance": 65,
            "Total": 130
        },
        "StoreName": "コンビニマート 東京国際フォーラム店",
        "StoreId": "familymart-9710347e-a261-4165-8404-29877287878a",
        "TicketLink": "https://telexistence.slack.com/archives/C02HD87KCRJ/p1664239447039489",
        "StaffName": "大森、岩瀬",
        "ErrorCase": {
            "ReportOther": {
                "Arm": true
            }
        },
        "Id": "07857284-5f09-4628-beaf-2f3d75e4319d"
    },
    {
        "WorkTime": {
            "Total": 80,
            "Maintenance": 60,
            "ToBack": 0,
            "Other": 10,
            "ToStore": 10
        },
        "WorkDate": "2023-01-28T08:43:57.357",
        "WorkLog": "テレオペ中のアームが動かなくなり、その後はSW起動も出来ない状態となった。（テクサポはTeamviewerに入れず）\nアームとボディはアプリのマニュアルコマンドでは問題なく動くが、SWを起動するとNotStartedYetとなってしまう。",
        "StaffName": "杉本",
        "StoreId": "familymart-01-tx-meti",
        "TicketLink": "https://telexistence.slack.com/archives/C02HD87KCRJ/p1664300857124939",
        "ErrorCase": {
            "Adjustment": {
                "Others": true
            }
        },
        "StoreName": "コンビニマート 経済産業省店",
        "Id": "dbabc206-5a98-4435-877c-1e1e10740d8d"
    },
    {
        "StoreId": "familymart-b9044093-85ff-4c8c-8ce3-4558d925da9e",
        "ErrorCase": {
            "RepairCable": {
                "Arm": true
            }
        },
        "TicketLink": "https://telexistence.slack.com/archives/C02HD87KCRJ/p1664295717021919",
        "WorkTime": {
            "Other": 5,
            "Total": 257,
            "ToStore": 32,
            "Maintenance": 190,
            "ToBack": 30
        },
        "StoreName": "コンビニマート 日本橋室町三井タワー店",
        "StaffName": "北村",
        "WorkDate": "2023-01-28T09:13:15.213",
        "Id": "48ba8472-043a-4af1-852b-c06b997c0666",
        "WorkLog": "FEカメラの映像が途切れるためケーブルの交換を実施"
    },
    {
        "WorkTime": {
            "ToBack": 30,
            "ToStore": 19,
            "Maintenance": 60,
            "Total": 119,
            "Other": 10
        },
        "WorkLog": "テレオペの途中からアームが動かなくなった。\nArmとBody側へのコマンドは問題なく動くが、起動するとNotStartedYetとなり、Failしてしまう。\nエンジニアへ確認中",
        "ErrorCase": {
            "Adjustment": {
                "Others": true
            }
        },
        "Id": "59bdc402-f86e-4a9f-9eb4-dc68842d147c",
        "TicketLink": "https://telexistence.slack.com/archives/C02HD87KCRJ/p1664300857124939",
        "WorkDate": "2023-01-28T23:42:58.142",
        "StoreId": "familymart-01-tx-meti",
        "StaffName": "杉本",
        "StoreName": "コンビニマート 経済産業省店"
    },
    {
        "StaffName": "大森",
        "ErrorCase": {
            "Adjustment": {
                "Others": true
            }
        },
        "WorkDate": "2023-01-28T23:45:08.039",
        "TicketLink": "https://telexistence.slack.com/archives/C02HD87KCRJ/p1664347516336569",
        "WorkTime": {
            "Maintenance": 153,
            "ToBack": 30,
            "ToStore": 95,
            "Total": 283,
            "Other": 5
        },
        "Id": "0a7e721d-2e43-494a-a74d-0561cee66245",
        "StoreName": "コンビニマート 経済産業省店",
        "WorkLog": "ロボットが動かないの続き\nAGXのSOFTWAREがクラッシュしていた。QAがsoftwareをアップデートして稼働OK",
        "StoreId": "familymart-01-tx-meti"
    },
    {
        "StoreId": "familymart-9710347e-a261-4165-8404-29877287878a",
        "Id": "15574d8c-3181-4e4a-9a28-8c1de2e02134",
        "ErrorCase": {
            "RepairCable": {
                "Arm": true
            }
        },
        "WorkDate": "2023-01-28T23:51:42.362",
        "WorkTime": {
            "Maintenance": 280,
            "ToBack": 30,
            "Total": 530,
            "Other": 0,
            "ToStore": 220
        },
        "StoreName": "コンビニマート 東京国際フォーラム店",
        "TicketLink": "https://telexistence.slack.com/archives/C02HD87KCRJ/p1664303445182019",
        "StaffName": "北村、大高",
        "WorkLog": "左右RSカメラケーブル交換"
    },
    {
        "WorkDate": "2023-02-02T00:00:00",
        "ErrorCase": {
            "Adjustment": {
                "Arm": true
            }
        },
        "TicketLink": "https://telexistence.slack.com/archives/C02HD87KCRJ/p1664436824588669",
        "StoreName": "コンビニマート ＭＭセンタービル店",
        "StaffName": "大高",
        "StoreId": "familymart-507610b2-4599-4689-be6a-735919b2da4c",
        "WorkLog": "A6軸調整およびグリッパー上部が棚に当たるため、棚の位置調整",
        "Id": "633308dc-75a6-47ad-b40b-2e1007232054",
        "WorkTime": {
            "ToStore": 365,
            "Total": 495,
            "Maintenance": 60,
            "Other": 10,
            "ToBack": 60
        }
    },
    {
        "WorkLog": "A６平行調整",
        "StaffName": "北村",
        "StoreName": "コンビニマート 東京国際フォーラム店",
        "TicketLink": "https://telexistence.slack.com/archives/C02HD87KCRJ/p1664373549182689",
        "Id": "f5d64976-5ae3-440f-aea8-aca32610ebb7",
        "WorkTime": {
            "Other": 5,
            "ToBack": 15,
            "Maintenance": 65,
            "Total": 125,
            "ToStore": 40
        },
        "ErrorCase": {
            "Adjustment": {
                "Arm": true
            }
        },
        "StoreId": "familymart-9710347e-a261-4165-8404-29877287878a",
        "WorkDate": "2023-02-02T06:09:25.276"
    }
]
function loadInitialData() {
    const addSingleJsonObject = 'http://127.0.0.1:5001/assignmenttestproject-8d3dd/us-central1/saveMaintenanceDataToFirestore';
    data.forEach(element => {
        axios.post(addSingleJsonObject, element)
            .then(response => {
                console.log('Request successful:', response.data);
            })
            .catch(error => {
                console.error('Request failed:', error);
            });
    });
}

//Test case for getting a specific store data
function getRequestTest(params, hasDates) {
    //Axios get call 
    //Choose Firebase function depending if we have dates or not
    const url = hasDates ? getDataRangeTestURL : getStoreDataURL;
    const dataArray = [];
    return axios.get(url, { params })
        .then(response => {
            response.data.forEach((result) => {
                // Process each result and add it to the dataArray
                dataArray.push(result);
            });
            console.log(dataArray);
            return dataArray;
        })
        .catch(error => {
            console.error('Request failed:', error);
        });
}

function patchRequestTest(params) {
    return axios.patch(`${patchTestURL}?ticketLink=${params["ticketLink"]}&updatedMaintenance=${params["updatedMaintenance"]}`)
        .then(response => {
            console.log('Request successful');
            return response.data;
        })
        .catch(error => {
            console.error('Error occurred');
            console.error(error.response.data);
        });
}

function clearFirestore() {
    return axios.get(clearCollectionURL)
        .then(response => {
            console.log('Collection cleared successfully');
            return response.data;
        })
        .catch(error => {
            console.error('Error clearing collection');
            console.error(error.response.data);
        });
}

module.exports = { loadInitialData, clearFirestore, getRequestTest, patchRequestTest };



