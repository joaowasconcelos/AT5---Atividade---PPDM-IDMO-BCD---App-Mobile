import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { DatabaseConnection } from "../../database/database";


export default function Editar() {
    const db = new DatabaseConnection.getConnection
    const [nome, setNome] = useState("")
    const [data_nasc, setData_nasc] = useState("")
    const [telefone, setTelefone] = useState("")


    const editaFilme = () => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE tbl_clientes SET nome = ?, data_nasc = ? WHERE id = ?',
                [nome, data_nasc, id],
                () => {
                    Alert.alert('Sucesso', 'Cliente atualizado com sucesso.');

                },
                (_, error) => {
                    Alert.alert('Erro', 'Erro ao atualizar cliente.');
                    console.error(error);
                }
            );


            db.transaction(innerTx => {
                innerTx.executeSql(
                    'UPDATE tbl_telefones SET numero = ? WHERE id = ?',
                    [telefone,id],
                    (_, resultTelefone) => {
                        const idTelefone = resultTelefone.insertId;
                        console.log("Telefone inserido com ID:", idTelefone);
                    });
            },
                (error) => console.log("Erro ao inserir telefone:", error)
            );
        });


        
    };

    return (
        <View>
            <Text>olá editar</Text>
        </View>
    )

}
