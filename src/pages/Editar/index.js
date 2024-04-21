import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView,Platform } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { DatabaseConnection } from "../../database/database";
import { useNavigation } from "@react-navigation/native";

export default function Editar({ route }) {
    const db = new DatabaseConnection.getConnection
   
    const { cliente } = route.params;
    const [nome, setNome] = useState(cliente.nome);
    const [data_nasc, setData_nasc] = useState(cliente.data_nasc);
    const [telefone, setTelefone] = useState(cliente.numero);


    const editaCliente = () => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE tbl_clientes SET nome = ?, data_nasc = ? WHERE id = ?',
                [nome, data_nasc, cliente.id],
                () => {
                    Alert.alert('Sucesso', 'Cliente atualizado com sucesso.');
                },
                (_, error) => {
                    Alert.alert('Erro', 'Erro ao atualizar cliente.');
                    console.error(error);
                }
            );
    
            tx.executeSql(
                'UPDATE tbl_telefones SET numero = ? WHERE id = ?',
                [telefone, id],
                (_, resultTelefone) => {
                    const idTelefone = resultTelefone.insertId;
                    console.log("Telefone inserido com ID:", idTelefone);
                },
                (error) => console.log("Erro ao inserir telefone:", error)
            );
        });

        setData_nasc("")
        setNome("")
        setTelefone("")
      
    };
    

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Text style={styles.title}>Nome:</Text>
            <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Nome"
                style={styles.input}
            />
            <Text style={styles.title}>Data de Nascimento:</Text>
            <TextInput
                value={data_nasc.toString()}
                onChangeText={setData_nasc}
                placeholder="Data de Nascimento"
                style={styles.input}
            />
            <Text style={styles.title}>Telefone:</Text>
            <TextInput
                 value={telefone.toString()} 
                onChangeText={setTelefone}
                placeholder="Telefone"
                style={styles.input}
                keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={editaCliente}>
                <Text style={styles.buttonText}>Atualizar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});
