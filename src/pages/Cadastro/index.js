import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { DatabaseConnection } from "../../database/database";


export default function Cadastro() {
    const db = new DatabaseConnection.getConnection
    const [nome, setNome] = useState("")
    const [data_nasc, setData_nasc] = useState("")
    const [telefone, setTelefone] = useState("")


    const Cadastrar = () => {

        if (!nome.trim() || !data_nasc.trim() || !telefone.trim()) {
            Alert.alert("Erro", "Por favor, preencha todos os campos");
            return;
        }

        db.transaction(tx => {
            try {
                tx.executeSql(
                    "INSERT INTO tbl_clientes (nome, data_nasc) VALUES (?, ?)",
                    [nome, data_nasc],
                    (_, resultCliente) => {
                        const idCliente = resultCliente.insertId;
                        console.log("Cliente inserido com ID:", idCliente);


                        db.transaction(innerTx => {
                            innerTx.executeSql(
                                "INSERT INTO tbl_telefones (numero) VALUES (?)",
                                [telefone],
                                (_, resultTelefone) => {
                                    const idTelefone = resultTelefone.insertId;
                                    console.log("Telefone inserido com ID:", idTelefone);


                                    innerTx.executeSql(
                                        "INSERT INTO tbl_telefones_has_tbl_pessoa (id_telefone, id_pessoa) VALUES (?, ?)",
                                        [idTelefone, idCliente],
                                        () => console.log("Relação inserida com sucesso"),
                                        (error) => console.log("Erro ao inserir relação:", error)
                                    );
                                },
                                (error) => console.log("Erro ao inserir telefone:", error)
                            );
                        });
                    },
                    (error) => console.log("Erro ao inserir cliente:", error)
                );
                Alert.alert("Info", "Registro inserido com sucesso");
                setData_nasc("")
                setNome("")
                setTelefone("")
            } catch (error) {
                Alert.alert("Erro", "Ocorreu um erro ao adicionar um filme");
            }


        });
    };




    return (

        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Nome:</Text>
            <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Nome"
                style={styles.input}
            />
            <Text style={styles.title}>Data de Nascimento:</Text>
            <TextInput
                value={data_nasc}
                onChangeText={setData_nasc}
                placeholder="Data de Nascimento"
                style={styles.input}

            />
            <Text style={styles.title}>Telefone:</Text>
            <TextInput
                value={telefone}
                onChangeText={setTelefone}
                placeholder="Telefone"
                style={styles.input}
                keyboardType="numeric"
            />
            <TouchableOpacity onPress={Cadastrar} style={styles.button}>
                <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 40,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: 'blue',
        width: "100%",
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});