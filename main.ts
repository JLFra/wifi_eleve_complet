//% groups=['Commun', 'Client', 'Serveur']
//% color="#037268" icon="\uf1eb"
namespace wifi {
    let port = '2000'
    //% block="Connexion au point d'accès SSID $SSID mot de passe $password adresse IP $adresse_IP Rx $Rx Tx $Tx"
    //% group='Commun'
    //% SSID.defl='SNT1' password.defl='12345678'
    //% adresse_IP.defl='192.168.0.5'
    //% Rx.defl=SerialPin.P0 Tx.defl=SerialPin.P14
    export function connect_AP_IP(SSID: string, password: string, adresse_IP: string, Rx: SerialPin, Tx: SerialPin): void {
        basic.showIcon(IconNames.Asleep)
        basic.pause(2000)
        serial.setRxBufferSize(100)
        serial.redirect(
        Tx,
        Rx,
        BaudRate.BaudRate115200
        )
        basic.pause(2000)
        basic.showIcon(IconNames.SmallSquare)
        serial.writeString("connect_to_AP,"+SSID+","+password)
        basic.pause(2000)
        let reception = ""
        while (reception == "") {
            serial.writeString("connected_to_AP?")
            reception = serial.readUntil(serial.delimiters(Delimiters.Hash))
            if (reception == "connected_to_AP") { 
                serial.writeString("set_IP_address_esp32,"+adresse_IP)
                basic.pause(100)
                basic.showString("C")
            }
            else {
                basic.showIcon(IconNames.Square)
                basic.pause(2000)	
            }
        }
    }
    //% block="Envoi $donnee au serveur adresse IP $adresseIP_serveur"
    //% group='Client'
    //% donnee.defl='essai' adresseIP_serveur.defl="192.168.0.101"
    export function envoi_donnee_serveur(donnee: string, adresseIP_serveur: string): void {
        let reception = ""
        let port = "2000"
        serial.writeString("Connect_to_server,"+adresseIP_serveur+","+port)
        reception = serial.readUntil(serial.delimiters(Delimiters.Hash))
        if (reception == "connected_to_server") {
            basic.showIcon(IconNames.Yes)
            serial.writeString("Send_to_Server,"+donnee)
        } else {
            basic.showIcon(IconNames.Sad)
        }
    }

    //% block="Donnee reçue du client"
    //% group='Serveur'
    export function donnee_recue(): string {
        serial.writeString("Start_Server,"+port)
        basic.pause(2000)
        serial.writeString("read_client_request")
        return serial.readUntil(serial.delimiters(Delimiters.Hash));
    }

    //% block="Adresse IP client connecté"
    //% group='Serveur'
    export function IPaddress_client_connected(): string {
        serial.writeString("IPaddress_client_connected?")
        return serial.readUntil(serial.delimiters(Delimiters.Hash));
    }

    //% block="Donnee reçue du serveur"
    //% group='Client'
    export function answer_server(): string {
        serial.writeString("answer_server")
        return serial.readUntil(serial.delimiters(Delimiters.Hash));
    }

    //% block="Envoi $reponse au client "
    //% group='Serveur'
    //% reponse.defl='reponse'
    export function answer_client_request(reponse: string): void {
        serial.writeString("answer_client_request,"+reponse)
    }

//% block="Initialise ESP32 Rx $Rx Tx $Tx Bauderate $bauderate"
    //% group='Commun'
    //% Rx.defl=SerialPin.P0 Tx.defl=SerialPin.P14 bauderate.defl=BaudRate.BaudRate115200
    export function initialise(Rx: SerialPin, Tx: SerialPin, bauderate: BaudRate): void {
        serial.setRxBufferSize(100)
        serial.redirect(
        Tx,
        Rx,
        bauderate
        )
        basic.pause(100)
    }

    //% block="Connexion au point d'accès SSID $SSID mot de passe $password"
    //% group='Commun'
    //% SSID.defl='launay' password.defl='12345789'
    export function connect_to_AP(SSID: string, password: string): void {
        serial.writeString("connect_to_AP,"+SSID+","+password)
        basic.pause(2000)
    }
	
	//% block="Adresse IP ESP32 = $adresseIP"
    //% group='Commun'
    //% adresseIP.defl='192.168.1.5'
    export function set_IP_Address_ESP32(adresseIP: string): void {
        serial.writeString("set_IP_address_esp32,"+adresseIP)
        basic.pause(100)
    }

    //% block="Connecté au point d'accès?"
    //% group='Commun'
    export function connected_to_AP(): boolean {
        let reception = ""
        serial.writeString("connected_to_AP?")
        reception = serial.readUntil(serial.delimiters(Delimiters.Hash))
        if (reception == "connected_to_AP") { 
            return true;
        } else {
            return false;
        }
    }

    //% block="Connexion au serveur adresse IP $adresseIP_serveur port $port"
    //% group='Client'
    //% adresseIP_serveur.defl="192.168.1.10" port.defl=2000
    export function connect_to_server(adresseIP_serveur: string, port: number): boolean {
        let reception = ""
        serial.writeString("Connect_to_server,"+adresseIP_serveur+","+port)
        reception = serial.readUntil(serial.delimiters(Delimiters.Hash))
        if (reception == "connected_to_server") {
            return true;
        } else {
            return false;
        }
    }

    //% block="envoi au serveur la donnée $data"
    //% group='Client'
    //% data.defl=''
    export function send_to_server(data: string): void {
        serial.writeString("Send_to_Server,"+data)
    }


    //% block="Demarrer serveur port $port"
    //% group='Serveur'
    //% port.defl=2000
    export function start_server(port: number): void {
        serial.writeString("Start_Server,"+port)
    }

    //% block="Client connecté?"
    //% group='Serveur'
    export function client_connected(port: number): boolean {
        serial.writeString("client_connected?")
        let reception = ""
        reception = serial.readUntil(serial.delimiters(Delimiters.Hash))
        if (reception == "client_connected_to_server") {
            return true;
        } else {
            return false;
        }
    }


    //% block="Requête client"
    //% group='Serveur'
    export function read_client_request(): string {
        serial.writeString("read_client_request")
        return serial.readUntil(serial.delimiters(Delimiters.Hash));
    }
}
