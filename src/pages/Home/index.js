import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { DatabaseConnection } from "../../database/database";


export default function Home() {
    const db = new DatabaseConnection.getConnection
    const navigation = useNavigation()

    function navegaCadastro() {
        navigation.navigate('Cadastro')
    }

    function PesquisaClientes() {
        navigation.navigate('PesquisaClientes')
    }

    function navegaTodosClientes() {
        navigation.navigate('TodosClientes')
    }

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS tbl_clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, data_nasc DATE)",
                [],
                () => console.log("Tabela 'tbl_clientes' criada com sucesso"),
                (error) => console.log("Erro ao criar tabela 'tbl_clientes':", error)
            );
    
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS tbl_telefones (id INTEGER PRIMARY KEY AUTOINCREMENT, numero TEXT)",
                [],
                () => console.log("Tabela 'tbl_telefones' criada com sucesso"),
                (error) => console.log("Erro ao criar tabela 'tbl_telefones':", error)
            );
    
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS tbl_telefones_has_tbl_pessoa 
                (id_telefone INTEGER, id_pessoa INTEGER, 
                FOREIGN KEY (id_telefone) REFERENCES tbl_telefones (id), 
                FOREIGN KEY (id_pessoa) REFERENCES tbl_clientes (id))`,
                [],
                () => console.log("Tabela 'tbl_telefones_has_tbl_pessoa' criada com sucesso"),
                (error) => console.log("Erro ao criar tabela 'tbl_telefones_has_tbl_pessoa':", error)
            );
        });
    }, []);
    
    



    return (
        <SafeAreaView>
            <Text>olá home</Text>
            <Button onPress={navegaCadastro} title="Cadastro" />
            <Button onPress={PesquisaClientes} title="Pesquisa Funcionario" />
            <Button onPress={navegaTodosClientes} title="Todos os funcionarios" />

        </SafeAreaView>
    )

}
