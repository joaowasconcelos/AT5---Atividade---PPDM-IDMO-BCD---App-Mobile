import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, Alert, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { DatabaseConnection } from '../../database/database';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
    const db = new DatabaseConnection.getConnection();
    const [input, setInput] = useState('');
    const [resultado, setResultado] = useState([]);


   
    const procurarFilme = () => {
        if (!input.trim()) {
            Alert.alert('Erro', 'Por favor, insira um termo para pesquisar o filme.');
            return;
        }

        db.transaction(tx => {
            tx.executeSql(
                `select 
                c.id,
                c.nome,
                c.data_nasc,
                t.numero
                from tbl_clientes c
                join tbl_telefones_has_tbl_pessoa ct on c.id=ct.id_pessoa
                join tbl_telefones t on ct.id_telefone = t.id
                WHERE c.nome LIKE ? OR t.numero LIKE ?;`,
                [`%${input}%`,`%${input}%`],
                (_, { rows }) => {
                    console.log(rows)
                    if (rows.length === 0) {
                        Alert.alert('Erro', 'Cliente não encontrado');
                    } else {
                        setResultado(rows._array);
                    }
                }
            );
        });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>

                    <View style={styles.header}>
                        <Text style={styles.headerText}>PESQUISAR UM Cliente</Text>
                       
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            style={styles.input}
                            placeholder="Digite o nome do cliente ou o ID"
                        />
                        <Button title="Procurar" onPress={procurarFilme} />
                    </View>

                    <View style={styles.tableHeader}>
                        <Text style={styles.columnHeader}>ID</Text>
                        <Text style={styles.columnHeader}>Nome</Text>
                        <Text style={styles.columnHeader}>Data Nascimento</Text>
                        <Text style={styles.columnHeader}>Numero</Text>
                    </View>

                    {resultado.map(cliente => (
                    <View key={cliente.id}>
                        <Text>ID: {cliente.id}</Text>
                        <Text>Nome: {cliente.nome}</Text>
                        <Text>Data Nascimento: {cliente.data_nasc}</Text>
                        <Text>Numero: {cliente.numero}</Text>

                    </View>
                ))}
                </View>

                
                
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
        content: {
            flex: 1,
            paddingHorizontal: 20,
            paddingVertical: 20,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
        },
        headerText: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
        },
        input: {
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 10,
            paddingHorizontal: 10,
            marginRight: 10,
        },
        tableHeader: {
            flexDirection: 'row',
            backgroundColor: 'lightgray',
            marginBottom: 10,
            paddingVertical: 5,
            borderRadius: 5,
        },
        columnHeader: {
            flex: 1,
            textAlign: 'center',
            fontWeight: 'bold',
        },
        tableRow: {
            flexDirection: 'row',
            marginBottom: 5,
            paddingVertical: 5,
            borderRadius: 5,
        },
        rowItem: {
            flex: 1,
            textAlign: 'center',
        }

    })