import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { DatabaseConnection } from "../../database/database";


export default function TodosClientes() {
    const db = new DatabaseConnection.getConnection
    const [todos, setTodos] = useState("")



    
    useEffect(() => {
        atualizaCliente();
    }, []);

    const atualizaCliente = () => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM tbl_clientes",
                [],
                (_, { rows }) => {
                    setTodos(rows._array); 
                    console.log(rows._array); 
                },
                (error) => console.log("Erro ao selecionar clientes:", error) 
            );
        });
    };
    
    return(
        <View>
            <Text>olá Todos os Funcionarios </Text>
        </View>
    )

}
