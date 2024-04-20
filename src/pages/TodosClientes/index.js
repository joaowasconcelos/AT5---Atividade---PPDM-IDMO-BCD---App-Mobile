import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { DatabaseConnection } from "../../database/database";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";


export default function TodosClientes() {
    const db = new DatabaseConnection.getConnection
    const navigation = useNavigation()
    const [todos, setTodos] = useState([])


    useEffect(() => {
        atualizaCliente();
    }, []);

    function navegaEditar() {
        navigation.navigate('Editar')
    }
    const atualizaCliente = () => {
        db.transaction(tx => {
            tx.executeSql(
                //'select * from tbl_clientes',
                // "SELECT c.id, c.nome, c.data_nasc, t.id AS id_telefone, t.numero FROM tbl_clientes c JOIN tbl_telefones_has_tbl_pessoa ct ON c.id = ct.id_clientes JOIN tbl_telefone t ON ct.id_telefone = t.id",
                `select 
                c.id,
                c.nome,
                c.data_nasc,
                t.numero
                from tbl_clientes c
                join tbl_telefones_has_tbl_pessoa ct on c.id=ct.id_pessoa
                join tbl_telefones t on ct.id_telefone = t.id;`,
                [],
                (_, { rows }) => {
                    setTodos(rows._array);
                    console.log(rows._array)
                },
                (error) => console.log("Erro ao selecionar clientes:", error)
            );
        });
    };

    


            const excluirFilme = id => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        `delete 
                from tbl_clientes c
                WHERE c.id = ?`,
                        [id],
                        (_, { rowsAffected }) => {
                            if (rowsAffected > 0) {
                                atualizaFilme();
                                Alert.alert('Sucesso', 'Registro excluído com sucesso.');
                            } else {
                                Alert.alert('Erro', 'Nenhum registro foi excluído, vertifique e tente novamente!');
                            }
                        },
                        (_, error) => {
                            console.error('Erro ao excluir o filme:', error);
                            Alert.alert('Erro', 'Ocorreu um erro ao excluir o filme.');
                        }
                    );
                }
            );
        };

        return (
            <SafeAreaView style={styles.container}>

                <ScrollView>
                    {todos.map(cliente => (
                        <View key={cliente.id} style={styles.itemContainer}>
                            <Text style={styles.text}>ID: {cliente.id}</Text>
                            <Text style={styles.text}>Nome: {cliente.nome}</Text>
                            <Text style={styles.text}>Data Nascimento: {cliente.data_nasc}</Text>
                            <Text style={styles.text}>Numero: {cliente.numero}</Text>

                            <View style={{ flexDirection: "row", gap: 10 }}>

                                <TouchableOpacity onPress={navegaEditar}>
                                    <FontAwesome6 name='pen-to-square' color={'green'} size={24} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    Alert.alert(
                                        "Atenção!",
                                        'Deseja excluir o registro selecionado?',
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => excluirFilme
                                            },
                                            {
                                                text: 'Cancelar',
                                                onPress: () => { },
                                                style: 'cancel',
                                            }
                                        ],
                                    )
                                }}>
                                    <FontAwesome6 name='trash-can' color={'red'} size={24} />
                                </TouchableOpacity>

                            </View>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        );


    }


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',

        },
        itemContainer: {
            marginBottom: 20,
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            width: 250,
            height: 180,
        },
        text: {
            marginBottom: 5,
        },
    })
