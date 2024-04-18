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
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO tbl_clientes (nome, data_nasc) VALUES (?, ?)",
                [nome, data_nasc],
                (_, resultCliente) => {
                    Alert.alert("Info", "Registro inserido com sucesso");
                    const idCliente = resultCliente.insertId;
                    console.log(resultCliente)

                    tx.executeSql(
                        "INSERT INTO tbl_telefones (numero) VALUES (?)",
                        [telefone],
                        (_, resultTelefone) => {
                            const idTelefone = resultTelefone.insertId;
                            console.log(resultTelefone)

                            tx.executeSql(
                                "INSERT INTO tbl_telefones_has_tbl_pessoa (id_telefone, id_pessoa) VALUES (?, ?)",
                                [idTelefone, idCliente],
                                () => console.log("Inserção concluída com sucesso"),
                                (error) => console.log("Erro ao inserir relação:", error)
                            );
                        },
                        (error) => console.log("Erro ao inserir telefone:", error)
                    );
                },
                (error) => console.log("Erro ao inserir cliente:", error)
                
            );
        });
    }


    
    return (
        <View>
            <Text>Nome:</Text>
            <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Nome"
            />
            <Text>Data de Nascimento:</Text>
            <TextInput
                value={data_nasc}
                onChangeText={setData_nasc}
                placeholder="Data de Nascimento"
            />
            <Text>Telefone:</Text>
            <TextInput
                value={telefone}
                onChangeText={setTelefone}
                placeholder="Telefone"
            />
            <Button title="Cadastrar" onPress={Cadastrar} />
        </View>
    );

}
